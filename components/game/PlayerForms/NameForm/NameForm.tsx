import { useCallback } from "react";
import { updatePlayer } from "@/lib/api/player";

interface NameFormProps {
	playerId: string;
}

const NameForm = ({ playerId }: NameFormProps) => {
	const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			displayName: { value: string };
		};

		updatePlayer(playerId, target.displayName.value)
			.then((res) => {
				console.log(res.data)
				// to do - success message
			})
			.catch((err: Error) => console.error(err))
	}, [playerId])
	
	return (
		<form onSubmit={onSubmit} className="text-center">
			<label>
				Set Your Display Name:
				<input
					type="text"
					name="displayName"
					required
					className="text-black"
				/>
			</label>
		</form>
	)
}

export default NameForm