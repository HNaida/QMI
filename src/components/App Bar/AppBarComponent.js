import { AppBar, makeStyles, Toolbar, Typography } from '@material-ui/core'
import history from '../../utils/history'
import LeftMenuBar from '../Left Menu Bar/LeftMenuBar'
import Grid from '@material-ui/core/Grid'
import React from 'react'
import MainPage from '../Editor/MainPage'
import { HomePage } from '../Home Page/HomePage'
import { EraseQuestionnaireButton } from './Navigation Buttons/EraseQuestionnaireButton'
import { RenderQuestionnaireButton } from './Navigation Buttons/RenderQuestionnaireButton'
import { SaveQuestionnaireButton } from './Navigation Buttons/SaveQuestionnaireButton'
import UserCard from '../Left Menu Bar/UserCard'
import {Route, Router, Switch, useLocation} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        color: "white",
        textAlign: "center",
        background: "linear-gradient(45deg, #7c4dff 30%, #80deea 90%)",
    },
}));

const AuxiliaryButtons = () => {
    const location = useLocation();
    if (location.pathname.includes("home")) return null;

    const elements = [
        <SaveQuestionnaireButton/>,
        <RenderQuestionnaireButton/>,
        <EraseQuestionnaireButton/>
    ];
    return elements.map(element => <Grid item>{element}</Grid>)
}


const AppBarComponent = ({theme, themeConfig, toggleDarkMode}) => {
    const classes = useStyles();

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <AppBar data-cy={theme.palette.type} className={classes.appBar}>
                <Toolbar>
                    <Router history={history}>
                        <LeftMenuBar themeConfig={themeConfig} toggleDarkMode={toggleDarkMode}/>
                        <Switch/>

                        <Grid container alignContent="center" alignItems="center">
                            <Grid item xs={3}>
                                <Grid container alignItems="center" spacing={1}>
                                    <AuxiliaryButtons/>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" className={classes.title}>Questionnaire Interface</Typography>
                            </Grid>
                            <Grid item xs={1}/>
                            <Grid item xs={2}>
                                <Grid container alignItems="flex-start" justify="flex-end">
                                    <UserCard/>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Router>

                </Toolbar>
            </AppBar>
            <Router history={history}>
                <Route path="/" exact>
                    <MainPage/>
                </Route>
                <Route path="/home">
                    <HomePage/>
                </Route>
            </Router>

        </div>
    );
}

export default AppBarComponent;
