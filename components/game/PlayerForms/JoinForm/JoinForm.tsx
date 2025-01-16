import { useCallback } from "react";

interface JoinFormPropTypes { 
	handleJoinGame: Function;
}

const JoinForm = ({
	handleJoinGame
}: JoinFormPropTypes) => {

	const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
		const target = e.target as typeof e.target & {
			gameCode: { value: string };
		};
		handleJoinGame(target.gameCode.value)
  }, [handleJoinGame]);

	return (
		<form onSubmit={onSubmit} className="text-center">
			<label>
				Enter Room Code: 
				<input
					type="text"
					name="gameCode"
					required
					className="text-black"
				/>
			</label>
			<p className="hint">No Game Code? Start a game first to get a code.</p>
		</form>
	)
}

export default JoinForm