import database from "@/infra/database";
import appointmentValidation from "./validation/appointment";
import userValidation from "./validation/user";
import { addMinutes, format, getDay } from "date-fns";

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

function calculateAvaliableHours(date, scheduledHours) {
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

      const finalIndex =
        index - 4 >= scheduledHours.length ? scheduledHours.length : index - 4;

      hoursList.splice(index, 4);
    }
  }

  return hoursList;
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

const appointment = {
  createAppointment,
  getAllProfessionals,
  getAllServices,
  getAvaliableHoursForProfessional,
};

const constraints = {
  date_time: {
    week: [
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
      {
        //Domingo
        morning: {},
        afternoon: {},
      },
    ],
  },
};

export default appointment;
