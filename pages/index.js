import Box from "./interface/components/Box";
import NavigationBar from "./interface/components/NavigationBar";
import calendarIcon from "public/icons/calendar.svg";
import clockRotateIcon from "public/icons/clock-rotate.svg";
import { useRouter } from "next/router";

function index() {
  const router = useRouter();

  return (
    <>
      <NavigationBar />
      <main className="py-12 px-16 flex flex-col items-center gap-12">
        <Box flex={true} direction="col" items="center" gap={3}>
          <h1 className="font-bold text-3xl">OLÁ!</h1>
          <h2 className="text-xl text-center">Como podemos te ajudar hoje?</h2>
        </Box>
        <Box flex={true} justify="center" gap={12} className="flex-wrap">
          <Box flex={true} direction="col" items="center" justify="center">
            <Box
              box={true}
              flex={true}
              className="z-10 p-12 py-8"
              color="light"
              direction="col"
              items="center"
              gap={12}
            >
              <img className="h-24" src={calendarIcon.src} />
              <p className="h-24 font-bold text-pool-white text-2xl gap-12">
                Agendamento
              </p>
            </Box>
            <Box
              box={true}
              className="-mt-10 z-20 w-44 hover:scale-105 active:scale-95 active:text-pool-white active:bg-pool-dark transition duration-150 overflow-hidden"
              color={"white"}
            >
              <button
                onClick={() => router.push("/agendamento")}
                className="p-4 w-60 text-center text-lg w-fit"
              >
                Realizar Agendamento
              </button>
            </Box>
          </Box>
          <Box flex={true} direction="col" items="center">
            <Box
              box={true}
              flex={true}
              className="z-10 p-12 py-8"
              color="light"
              direction="col"
              items="center"
              gap={12}
            >
              <img className="h-24" src={clockRotateIcon.src} />
              <p className="h-24 font-bold text-center text-pool-white text-2xl">
                Histórico de
                <br />
                agendamento
              </p>
            </Box>
            <Box
              box={true}
              className="-mt-10 z-20 w-44 hover:scale-105 active:scale-95 active:text-pool-white active:bg-pool-dark transition duration-150 overflow-hidden"
              color={"white"}
            >
              <button
                onClick={() => router.push("/historico")}
                className="px-6 p-4 w-fit text-center text-lg"
              >
                Visualizar histórico
              </button>
            </Box>
          </Box>
        </Box>
      </main>
    </>
  );
}

export default index;
