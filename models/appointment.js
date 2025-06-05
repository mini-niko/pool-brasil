import database from "@/infra/database";
import appointmentValidation from "./validation/appointment";
import userValidation from "./validation/user";
import { addMinutes, format, getDay, parseISO } from "date-fns";

async function createAppointment(appointment) {
  appointmentValidation.validate(appointment);

  const response = await database.query(
    `
    WITH new_location AS (
      INSERT INTO appointment_location (
        state,
        city,
        street,
        number,
        complement,
        reference,
        latitude, 
        longitude
      )
      VALUES (
        $1, 
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8
      )
      RETURNING *
    ), 
    new_appointment AS (
      INSERT INTO 
        appointments (
          client_id, 
          professional_id,
          date_time,
          appointment_location_id
        )
      VALUES (
        $9,
        $10,
        $11,
        (SELECT id FROM new_location)
      )
      RETURNING *
    ), 
    _appointments_services AS (
      INSERT INTO appointments_services (appointment_id, service_id)
      SELECT id, $12 FROM new_appointment
    )
    SELECT 
        a.*,
        l.state,
        l.city,
        l.street,
        l.number,
        l.complement,
        l.reference,
        l.latitude,
        l.longitude
    FROM new_appointment a
    JOIN new_location l ON a.appointment_location_id = l.id;
    ;`,
    [
      appointment.location.state,
      appointment.location.city,
      appointment.location.street,
      appointment.location.number,
      appointment.location.complement || "",
      appointment.location.reference || "",
      appointment.location.latitude,
      appointment.location.longitude,
      appointment.client_id,
      appointment.professional_id,
      appointment.date_time,
      appointment.service_id,
    ],
  );

  const {
    latitude,
    longitude,
    state,
    city,
    street,
    number,
    complement,
    reference,
    ...rest
  } = response.rows[0];

  const newAppointment = {
    ...rest,
    location: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      state: state,
      city: city,
      street: street,
      number: number,
      complement: complement,
      reference: reference,
    },
  };

  return newAppointment;
}

async function getAvaliableHoursForProfessional(id, date) {
  userValidation.validID(id);
  appointmentValidation.validateDate(date);

  const response = await database.query(
    ` SELECT date_time FROM appointments WHERE professional_id = $1 AND date_time::date = $2 ;`,
    [id, date],
  );

  const scheduledHours = response.rows.map((row) => {
    const date = new Date(row.date_time);

    return format(date, "HH:mm");
  });

  const avaliableHoursList = calculateAvaliableHours(date, scheduledHours);

  return avaliableHoursList;
}

function calculateAvaliableHours(dateString, scheduledHours) {
  const date = parseISO(dateString);
  const dayOfWeek = getDay(date);

  const constraint = constraints.date_time.week[dayOfWeek];

  const hoursList = [];

  if (constraint.morning.hours) {
    const hours = constraint.morning.hours;

    const initialTimeInMinutes = hours.start * 60;

    const endTimeInMinutes = hours.end * 60;

    const startTime = new Date();
    startTime.setHours(0, initialTimeInMinutes);

    const endTime = new Date();
    endTime.setHours(0, endTimeInMinutes);

    let currentTime = startTime;
    while (currentTime <= endTime) {
      hoursList.push(format(currentTime, "HH:mm"));

      currentTime = addMinutes(currentTime, 15);
    }
  }

  if (constraint.afternoon.hours) {
    const hours = constraint.afternoon.hours;

    const initialTimeInMinutes = hours.start * 60;

    const endTimeInMinutes = hours.end * 60;

    const startTime = new Date();
    startTime.setHours(0, initialTimeInMinutes);

    const endTime = new Date();
    endTime.setHours(0, endTimeInMinutes);

    let currentTime = startTime;

    while (currentTime <= endTime) {
      hoursList.push(format(currentTime, "HH:mm"));

      currentTime = addMinutes(currentTime, 15);
    }
  }

  if (hoursList.length !== 0) {
    for (let scheduledHour of scheduledHours) {
      const index = hoursList.indexOf(scheduledHour);

      hoursList.splice(index, 4);
    }
  }

  return hoursList;
}

async function getAllAppointmentsFromUserId(userId) {
  userValidation.validID(userId);

  const response = await database.query(
    `
    SELECT
      a.id,
      a.date_time,
      a.status,
      a.created_at,
      s.type,
      uc.name as client_name,
      uc.email as client_email,
      pc.name as professional_name,
      pc.email as professional_email,
      al.latitude,
      al.longitude,
      al.state,
      al.city,
      al.street,
      al.number,
      al.complement,
      al.reference
    FROM appointments a
    LEFT JOIN users uc
    ON 
      a.client_id = uc.id
    LEFT JOIN users pc
    ON 
      a.professional_id = pc.id
    LEFT JOIN appointment_location al
    ON 
      a.appointment_location_id = al.id
    LEFT JOIN appointments_services aps
    ON 
      a.id = aps.appointment_id
    LEFT JOIN services s
    ON
      s.id = aps.service_id
    WHERE
      a.client_id = $1
      OR
      a.professional_id = $1
    ;`,
    [userId],
  );

  const appointments = response.rows.map(formatAppointment);

  return appointments;
}

function formatAppointment(appointment) {
  const {
    client_name,
    client_email,
    professional_name,
    professional_email,
    latitude,
    longitude,
    state,
    city,
    street,
    number,
    complement,
    reference,
    ...rest
  } = appointment;

  const statusList = {
    pending: "Pendente",
    confirmed: "Confirmado",
    cancelled: "Cancelado",
    done: "Finalizado",
  };

  const address = `${street}, ${number}${
    complement ? `, complement` : ""
  }, ${city
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}, ${state}`;

  return {
    ...rest,
    status: statusList[appointment.status],
    client: {
      name: client_name,
      email: client_email,
    },
    professional: {
      name: professional_name,
      email: professional_email,
    },
    location: {
      longitude,
      latitude,
      address,
      reference,
    },
  };
}

async function getAllProfessionals() {
  const response = await database.query(
    `
    SELECT id, name 
    FROM users 
    WHERE 'professional' = ANY(features)
    ;`,
  );

  return response.rows;
}

async function getAllServices() {
  const response = await database.query(
    `
    SELECT * 
    FROM services 
    ;`,
  );

  return response.rows;
}

async function updateAppointment(appointmentData) {
  await database.query(
    `
    UPDATE
      appointments
    SET
      status = $1
    WHERE
      appointments.id = $2
    `,
    [appointmentData.status, appointmentData.id],
  );
}

const appointment = {
  createAppointment,
  getAllAppointmentsFromUserId,
  getAllProfessionals,
  getAllServices,
  getAvaliableHoursForProfessional,
  updateAppointment,
};

const constraints = {
  date_time: {
    week: [
      {
        //Domingo
        morning: {},
        afternoon: {},
      },
      {
        //Segunda
        morning: {},
        afternoon: {
          hours: {
            start: 13.5,
            end: 18,
          },
        },
      },
      {
        //Terça
        morning: {},
        afternoon: {
          hours: {
            start: 13.5,
            end: 18,
          },
        },
      },
      {
        //Quarta
        morning: {},
        afternoon: {
          hours: {
            start: 13.5,
            end: 18,
          },
        },
      },
      {
        //Quinta
        morning: {},
        afternoon: {},
      },
      {
        //Sexta
        morning: false,
        afternoon: {
          hours: {
            start: 13.5,
            end: 18,
          },
        },
      },
      {
        //Sábado
        morning: {
          hours: {
            start: 7,
            end: 12,
          },
        },
        afternoon: {
          hours: {
            start: 13.5,
            end: 18,
          },
        },
      },
    ],
  },
};

export default appointment;
