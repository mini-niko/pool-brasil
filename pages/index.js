import Box from "./interface/components/Box";
import NavigationBar from "./interface/components/NavigationBar";
import calendarIcon from "public/icons/calendar.svg";
import clockRotateIcon from "public/icons/clock-rotate.svg";
import { useRouter } from "next/router";

function index() {
  const router = useRouter()

  return(
    <>
      <NavigationBar />
      <main className="p-16 flex flex-col items-center gap-24">
        <Box flex={true} direction="col" items="center" gap={6}>
          <h1 className="font-bold text-4xl">OLÁ!</h1>
          <h2 className="text-3xl">Como podemos te ajudar hoje?</h2>
        </Box>
        <Box flex={true} justify="center" gap={24}>
          <Box flex={true} direction="col" items="center">
            <Box
              box={true}
              flex={true}
              className="z-10 p-16 py-8"
              color="light"
              direction="col"
              items="center"
              gap={12}
            >
              <img className="h-36" src={calendarIcon.src} />
              <p className="h-28 font-bold text-pool-white text-2xl gap-12">
                Agendamento
              </p>
            </Box>
            <Box box={true} className="-mt-10 z-20" color={"white"}>
              <button onClick={() => router.push("/agendamento")} className="px-6 py-4 w-60 text-center text-lg">
                Realizar Agendamento
              </button>
            </Box>
          </Box>
          <Box flex={true} direction="col" items="center">
            <Box
              box={true}
              flex={true}
              className="z-10 p-16 py-8"
              color="light"
              direction="col"
              items="center"
              gap={12}
            >
              <img className="h-36" src={clockRotateIcon.src} />
              <p className="h-28 font-bold text-center text-pool-white text-2xl">
                Histórico de
                <br />
                agendamento
              </p>
            </Box>
            <Box box={true} className="-mt-10 z-20" color={"white"}>
              <button onClick={() => router.push("/historico")} className="px-6 py-4 w-60 text-center text-lg">
                Visualizar histórico
              </button>
            </Box>
          </Box>
        </Box>
      </main>
    </>,
  );
}

export default index;
