import React, {useEffect, useState} from "react";
import GamePreview from "./GamePreview";
import {Platform} from "../../Global/Platform/platform";
import {UserDataStore} from "../../Global/DataStore/UserDataStore";
import {GameDataStore} from "../../Global/DataStore/GameDataStore";
import Typography from "@material-ui/core/Typography";
import {GameSettings} from "./Components/GameSettings";
import Divider from "@material-ui/core/Divider";
import {LoadingButton} from "../../UI/LoadingButton";
import {MdAdd} from "react-icons/all";
import {useDataStore} from "../../Global/Utils/HookUtils";
import {Tooltip} from "@material-ui/core";
import Button from "@material-ui/core/Button";

interface IGameStartProps
{
	id: string;
}

const GameStart: React.FC<IGameStartProps> = (props) =>
{
	const gameData = useDataStore(GameDataStore);
	const userData = useDataStore(UserDataStore);
	const [startLoading, setStartLoading] = useState(false);
	const [randomPlayerLoading, setRandomPlayerLoading] = useState(false);

	const onClickStart = () =>
	{
		setStartLoading(true);

		Platform.startGame(
			UserDataStore.state.playerGuid,
			props.id,
			gameData.includedPacks,
			gameData.includedCardcastPacks,
			gameData.roundsRequired,
			gameData.inviteLink,
			gameData.password)
			.catch(e => console.error(e))
			.finally(() => setStartLoading(false));
	};

	const onClickAddRandom = () =>
	{
		setRandomPlayerLoading(true);
		GameDataStore.addRandomPlayer(userData.playerGuid)
			.finally(() => setRandomPlayerLoading(false));
	};

	const players = gameData.game?.players ?? {};
	const playerGuids = Object.keys(gameData.game?.players ?? {});
	const randomPlayers = playerGuids.filter(pg => players[pg]?.isRandom) ?? [];
	const nonRandomPlayers = playerGuids.filter(pg => !players[pg]?.isRandom) ?? [];
	const canStart = nonRandomPlayers.length > 1;
	const canAddRandom = randomPlayers.length < 10;

	return (
		<GamePreview id={props.id}>
			<LoadingButton loading={startLoading} variant={"contained"} color={"primary"} onClick={onClickStart} disabled={!canStart}>
				Start
			</LoadingButton>
			<Tooltip arrow title={"A fake player! If he wins, everyone else feels shame. Add up to 10."}>
				<Button startIcon={<MdAdd/>} variant={"contained"} color={"primary"} onClick={onClickAddRandom} style={{marginLeft: "1rem"}} disabled={!canAddRandom}>
					AI Player
				</Button>
			</Tooltip>
			<Divider style={{margin: "3rem 0"}}/>
			<Typography variant={"h4"}>Settings</Typography>
			<GameSettings/>
		</GamePreview>
	);
};

export default GameStart;