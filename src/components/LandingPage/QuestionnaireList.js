import {API_STATUS} from "../../features/API/ApiHandler";
import GridList from "@material-ui/core/GridList";
import {makeStyles, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import GridListTile from "@material-ui/core/GridListTile";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import EditIcon from "@material-ui/icons/Edit";
import React, {useEffect, useState} from "react";
import {auth_config} from "../../features/API/auth_config";
import {useAuth0} from "../react-auth0-spa";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    card: {
        minWidth: 500,

    },
    title: {
        fontSize: 14,
    },
    subtitle: {
        fontSize: 10,
    },
}));

export const QuestionnaireList = ({setCurrentQuestionnaireKey}) => {
    const classes = useStyles();
    const {isAuthenticated, getIdTokenClaims, loading} = useAuth0();
    const [questionnaireListState, setQuestionnaireListState] = useState({status: API_STATUS.INIT, body: []});
    useEffect(() => {
        if(questionnaireListState.status === API_STATUS.INIT){
            retrieveQuestionnaires();
        }
    });

    const getAllQuestionnairesAsync = async () => {
        const itc = await getIdTokenClaims();
        const unirest = require('unirest');
        return unirest('GET', auth_config.base + '/api/v1/questionnaire')
            .headers({
                'Authorization': `Bearer ${itc.__raw}`
            })
    }
    const retrieveQuestionnaires = () => {
        if(!isAuthenticated){
            return;
        }
        setQuestionnaireListState({status: API_STATUS.LOADING, body: "Retrieving questionnaires"});
        const errorCatcher = error => {
            setQuestionnaireListState({status: API_STATUS.ERROR, body: error.message()});
        };

        try{
            getAllQuestionnairesAsync()
                .then(response => {
                    if(response.error && response.error.message.includes("NetworkError")){
                        setQuestionnaireListState({status: API_STATUS.ERROR, body: "The server cannot be reached."})
                        return;
                    }
                    if(response.error){
                        setQuestionnaireListState({status: API_STATUS.ERROR, body: response.message()});
                    }
                    setQuestionnaireListState({status: API_STATUS.IDLE, body: response.body});
                })
        }catch(error){
            errorCatcher(error);
        }

    }
    const renderStatusMessage = (status) =>{
        console.log(status);
        if(questionnaireListState.status === API_STATUS.IDLE && questionnaireListState.body === []){
            return <Alert severity="info">
                <AlertTitle>No questionnaires are available.</AlertTitle>
            </Alert>
        }

        if(loading){
            return <Alert severity="info">
                <AlertTitle>Info </AlertTitle>
                <Grid container spacing={3}>
                    <Grid item><CircularProgress size={20}/></Grid>
                    <Grid item>Logging in</Grid>
                </Grid>

            </Alert>
        }

        switch (status){

            case API_STATUS.LOADING:
                return <Alert severity="info">
                    <AlertTitle>Info </AlertTitle>
                    <Grid container spacing={3}>
                        <Grid item><CircularProgress size={20}/></Grid>
                        <Grid item>{questionnaireListState.body}</Grid>
                    </Grid>

                </Alert>
            case API_STATUS.ERROR:
                return  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {questionnaireListState.body}
                </Alert>
            case API_STATUS.INIT:
            case API_STATUS.NOT_AUTHENTICATED:
                return <Alert severity="info">
                    <AlertTitle>Info</AlertTitle>
                    Please log in.
                </Alert>
            case API_STATUS.IDLE:
                return renderQuestionnaires();
        }
    }
    const renderQuestionnaires = () =>{
        return<GridList cols={4} spacing={10}>
            {questionnaireListState.body.map(json =>
                <GridListTile key={json.key} className={classes.tile}>
                    <QuestionnaireCard questionnaire={json}/>
                </GridListTile>
            )}
        </GridList>
    }

    const QuestionnaireCard = ({questionnaire}) => {
        return <Card className={classes.card}>
            <CardActionArea type="button" onClick={() => setCurrentQuestionnaireKey(questionnaire.key)}>
                <CardContent>
                    <Typography className={classes.title} variant="h3">{questionnaire.title}</Typography>
                    <Typography className={classes.subtitle} variant="subtitle1">{questionnaire.key}</Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <IconButton onClick={() => setCurrentQuestionnaireKey(questionnaire.key)}><InfoIcon/></IconButton>
                <IconButton
                    onClick={() => {console.log("Load questionnaire data into state, redirect to editor");}}>
                    <EditIcon/>
                </IconButton>
            </CardActions>
        </Card>
    }

    return renderStatusMessage(questionnaireListState.status);
};
