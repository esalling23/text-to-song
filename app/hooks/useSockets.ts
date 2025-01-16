import { useGameStateCtx } from "@/context";
import { useEffect, useState } from "react";
import { socket, SOCKET_EVENTS } from "../../socket";
import { setSocketId } from "@/context/actions";
import { Dispatch } from "@reduxjs/toolkit";
import { GameAction } from "@/context/reducer";

const useSockets = (gameDispatch: React.Dispatch<GameAction>) => {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
	const [socketIdState, setSocketIdState] = useState<string|null>(null);

	// console.log(gameState)
  useEffect(() => {
    if (socket.connected) {
			onConnect();
    }
		
    function onConnect() {
			console.log('onConnect', socket.id)
			setSocketIdState(socket.id || null)
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

		function onConnected (socketId: string) {
			console.log('connected to socket', socketId)
			setSocketIdState(socketId)
		}

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

		socket.on('*', console.log)

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(SOCKET_EVENTS.CONNECTED, onConnected);
		
    return () => {
			socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
			socket.off(SOCKET_EVENTS.CONNECTED, onConnected);
    };
  }, []);

	useEffect(() => {
		if (socketIdState) {
			gameDispatch(setSocketId(socketIdState))
		}
	}, [gameDispatch, socketIdState])

	return {
		isConnected,
		transport
	}
}

export default useSockets;