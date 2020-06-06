import React, {useEffect} from 'react'
import {CssBaseline, Grid, makeStyles} from "@material-ui/core";
import {DragDropContext} from "react-beautiful-dnd";
import "./index.css";
import {QUESTION_TYPES} from "./QuestionTypes";
import {QuestionTypesMenu} from "../QuestionTypesMenu";
import {QuestionsArea} from "../QuestionsArea";
import {JSONTranslationArea} from "../JSONTranslationArea";
import {useDispatch, useSelector} from "react-redux";
import {CLONE, REORDER} from "../features/questions/questionsSlice";
import {addToMap, CLEAR_MAPS} from "../features/utilities/utilitiesSlice";
import BackToTopArrowButton from "../BackToTopArrowButton";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
}));

const MainPage = () => {
    const questions = useSelector(state => state.questions);
    const dispatch = useDispatch();

    const onDragEnd = React.useCallback(result => {
        const {source, destination} = result;
        if (!destination) {
            return;
        }
        switch (source.droppableId) {
            case "BAG":
                dispatch(REORDER({source: source, destination: destination}));
                break;
            case "SHOP":
                dispatch(CLONE({source: source, destination: destination}));
                console.log(destination);
                console.log(questions[destination.index]);
                break;
            default:
                break;
        }
    }, []);
    const classes = useStyles();

    let count = 0;
    useEffect(() => {
        if (count === 0) {
            // computeMaps
            dispatch(CLEAR_MAPS());
            // 1) go through the questionnaire
            for (let i = 0; i < questions.length; i++) {
                // 2) check if "radio" or "checkbox" type
                if (questions[i].type === "radio" || questions[i].type === "checkbox") {
                    // 3) go through the question's options
                    for (let j = 0; j < questions[i].options.length; j++) {
                        // 4) check if "string" or "object" type
                        if (typeof (questions[i].options[j]) === "object") {
                            // 5) check if "shows_questions" or "hides_questions" is not undefined
                            if (questions[i].options[j].shows_questions !== undefined && questions[i].options[j].shows_questions.length > 0) {
                                // 6) go through the shows_questions and add to correct map
                                for (let k = 0; k < questions[i].options[j].shows_questions.length; k++) {
                                    dispatch(addToMap({
                                        type: 'showsMap',
                                        key: questions[i].options[j].shows_questions[k],
                                        value: {qid: questions[i].id, oid: questions[i].options[j].id},
                                    }))
                                }
                                // 7) go through the hides_questions and add to correct map
                                for (let k = 0; k < questions[i].options[j].hides_questions.length; k++) {
                                    dispatch(addToMap({
                                        type: 'hidesMap',
                                        key: questions[i].options[j].hides_questions[k],
                                        value: {qid: questions[i].id, oid: questions[i].options[j].id},
                                    }))
                                }
                            }
                        }
                    }
                }
            }
        }
        count++;
        // localStorage.setItem("qmi-data", JSON.stringify(questions));
        // *****
        // localStorage.setItem("qmi-utilities", JSON.stringify(store.getState().utilities))
        // dispatch(CLEAR_MAPS());
        return () => {
            dispatch(CLEAR_MAPS());
            // localStorage.clear();
        }
    }, [questions]);

    return (
        <div data-cy="questionsPage" className={classes.root}>
            <CssBaseline/>
            <DragDropContext onDragEnd={onDragEnd}>
                <QuestionTypesMenu items={QUESTION_TYPES}/>
                <main className={classes.content}>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                        style={{
                            margin: "0",
                        }}
                    >
                        <JSONTranslationArea/>
                        <QuestionsArea/>

                        <BackToTopArrowButton/>
                        {count++}
                    </Grid>
                </main>

            </DragDropContext>
        </div>
    );
};

export default MainPage;

