import { useGameStateCtx } from "@/context";
import { RoomData } from "@/lib/types";
import { useEffect, useState } from "react";
import { socket, SOCKET_EVENTS } from "../../socket";

const useSockets = () => {
	const { gameDispatch, gameState } = useGameStateCtx();

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

	// console.log(gameState)
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [gameDispatch]);

	return {
		isConnected,
		transport
	}
}

export default useSockets;