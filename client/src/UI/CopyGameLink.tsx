import {CopyToClipboard} from "react-copy-to-clipboard";
import React, {useEffect, useState} from "react";
import {GameDataStore} from "../Global/DataStore/GameDataStore";
import {Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Chip from "@material-ui/core/Chip";
import {Twemoji} from "react-emoji-render";

export interface ICopyGameLinkProps
{
	className?: string;
	buttonSize?: "small" | "medium" | "large";
}

const useStyles = makeStyles({
	link: {
		color: "black",
		textDecoration: "none",
		marginRight: "1rem",
		"&:hover": {
			textDecoration: "underline"
		}
	}
});

export const CopyGameLink: React.FC<ICopyGameLinkProps> = (props) =>
{
	const classes = useStyles();

	const [copied, setCopied] = useState(false);

	const [gameData, setGameData] = useState(GameDataStore.state);

	useEffect(() =>
	{
		GameDataStore.listen(setGameData);
	}, []);

	const onCopy = () =>
	{
		setCopied(true);

		setTimeout(() => setCopied(false), 3000);
	};

	if (!gameData.game)
	{
		return null;
	}

	const shareLabel = copied ? "Copied!" : "Copy";

	const link = `${location.host}/game/${gameData.game?.id}`;
	const fullLink = `${location.protocol}//${link}`;

	return (
		<>
			<Typography>
				Send this link to the players in your party:
			</Typography>
			<br/>
			<Chip
				variant={"outlined"}
				label={
					<a href={fullLink} className={classes.link}>
						{link}
					</a>
				}
				onDelete={() =>
				{
				}}
				deleteIcon={
					<CopyToClipboard text={fullLink} onCopy={onCopy}>
						<Chip
							color={"primary"}
							label={shareLabel}
							style={{width: 75, color: "white"}}
						/>
					</CopyToClipboard>
				}
			/>

		</>
	);
};