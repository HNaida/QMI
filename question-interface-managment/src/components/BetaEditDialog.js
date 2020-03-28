import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Dialog,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { QuestionnaireContext } from "../contexts/QuestionnaireContext";
import { SettingsContext } from "../contexts/SettingsContext";
import { NewQuestionContext } from "../contexts/NewQuestionContext";
import ToggleGridAreasButton from "./buttons/ToggleGridAreasButton";
import {
  HiddenProperty, OtherwiseLabelProperty, OtherwiseTooltipProperty,
  RequiredProperty,
  ShowOtherwiseProperty,
  TextOptionsProperty,
  TitleProperty, TooltipProperty
} from "./QuestionnaireProperties";

const EditDialog = ({ question, open, setOpen }) => {
  const [optionAdded, setOptionAdded] = useState(false);
  const { settings } = useContext(SettingsContext);
  const { dispatch } = useContext(QuestionnaireContext);
  const { newQuestion, newQuestionDispatch } = useContext(NewQuestionContext);

  // load question to editor state on dialog open
  useEffect(() => {
    newQuestionDispatch({ type: "SET_QUESTION", question: { ...question } });
  }, [open, newQuestionDispatch, question]);

  // dispatch action to questionnaireReducer to update question
  const handleSubmit = event => {
    event.preventDefault();
    dispatch({ type: "UPDATE_QUESTION", id: question.id, new: newQuestion });
    setOpen(false);
    newQuestionDispatch({
      type: "SET_QUESTION",
      question: { title: "", options: [] }
    });
  };

  const handleClose = () => {
    setOpen(false);
    setOptionAdded(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      {/* <ToggleGridAreasButton /> */}
      <form onSubmit={handleSubmit} style={{ padding: "1em" }}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
          style={{
            padding: "2em",
            background: settings.showGridAreas ? "lightgrey" : "transparent"
          }}
        >
          <DialogHeader question={question} />
          <DialogBody/>
          <DialogFooter handleClose={handleClose} />
        </Grid>
      </form>
    </Dialog>
  );
};

export default EditDialog;

const DialogHeader = ({ question }) => {
  const { settings } = useContext(SettingsContext);
  const { questions } = useContext(QuestionnaireContext);
  const { newQuestion, newQuestionDispatch } = useContext(NewQuestionContext);

  const GridItem = (props) => (
    <Grid
      item
      xs={12}
      style={{
        textAlign: props.textAlign,
        background: settings.showGridAreas ? "lightblue" : "transparent",
        opacity: settings.showGridAreas ? 0.9 : 1.0
      }}
    >
      {props.children}
    </Grid>
  );

  const TypeSelector = () => (
    <Select
    autoWidth
    labelId="type-select-label"
    value={newQuestion.type}
    onChange={e =>
      newQuestionDispatch({
        type: "SET_QUESTION",
        question: { ...newQuestion, type: e.target.value }
      })
    }
    style={{ textAlign: "left" }}
  >
      {/*TODO: not everything is compatible for convert, so only show what's allowed.*/}
    <MenuItem value="radio">Radio</MenuItem>
    <MenuItem value="checkbox">Checkbox</MenuItem>
    <MenuItem value="range">Range</MenuItem>
    <MenuItem value="likert">Likert</MenuItem>
  </Select>
  );

  const QuestionTitle = () => (
    <Typography variant="h5">
      Edit Question {questions.indexOf(question) + 1}
    </Typography>
  );

  return (
    <GridItem textAlign="right">
      <FormControl>
        <InputLabel id="type-select-label">Type</InputLabel>
        <TypeSelector/>
      </FormControl>
      <Grid container="row" justify="center" alignItems="center">
        <GridItem textAlign="left">
          <QuestionTitle/>
        </GridItem>
      </Grid>
    </GridItem>
  );
};

const DialogBody = () => {
  const { settings } = useContext(SettingsContext);
  const { newQuestion, newQuestionDispatch } = useContext(NewQuestionContext);

  // Grid for boolean items. These are switches, checkboxes, etc.
  const BooleanGrid = (props) =>
    <Grid item xs={4}>
      <h3>Misc.</h3>
      {props.children}
    </Grid>

  return (
    <Grid container direction="row" justify="center" alignItems="center" spacing={3}>
      <Grid
        item
        xs={12}
        style={{
          background: settings.showGridAreas ? "lightcoral" : "transparent",
          opacity: settings.showGridAreas ? 0.9 : 1.0
        }}
      >
        <TitleProperty
          required
          newQuestion={newQuestion}
          newQuestionDispatch={newQuestionDispatch}
          style={{ margin: "1em 0" }}
        />
      </Grid>

      <BooleanGrid>
        <RequiredProperty newQuestion={newQuestion} newQuestionDispatch={newQuestionDispatch} />
        <ShowOtherwiseProperty newQuestion={newQuestion} newQuestionDispatch={newQuestionDispatch} />
        {newQuestion.show_otherwise ?
          <Grid item xs style={{ textAlign: "center", margin: "1em 0" }}>
            <OtherwiseLabelProperty newQuestion={newQuestion} newQuestionDispatch={newQuestionDispatch}/>
            <OtherwiseTooltipProperty newQuestion={newQuestion} newQuestionDispatch={newQuestionDispatch}/>
          </Grid>
          : null}

        <HiddenProperty newQuestion={newQuestion} newQuestionDispatch={newQuestionDispatch} />
        <Grid item xs style={{ textAlign: "center", margin: "1em 0" }}>
          <TooltipProperty newQuestion={newQuestion} newQuestionDispatch={newQuestionDispatch}/>
        </Grid>
      </BooleanGrid>

      <Grid item xs style={{ textAlign: "center", margin: "1em 0" }}>
        <TextOptionsProperty newQuestion={newQuestion} newQuestionDispatch={newQuestionDispatch}/>
      </Grid>
    </Grid>
  );
};

const DialogFooter = ({ handleClose }) => {
  const { settings } = useContext(SettingsContext);

  const GridItem = (props) => (
    <Grid
    item
    xs
    style={{
      textAlign: "center",
      background: settings.showGridAreas ? "yellow" : "transparent",
      opacity: settings.showGridAreas ? 0.9 : 1.0
    }}
  >{props.children}</Grid>
  );


  return (
    <Grid
      container
      direction="row"
      alignItem="flex-start"
      justify="flex-end"
      style={{
        padding: "2em",
        background: settings.showGridAreas ? "lightgrey" : "transparent"
      }}
    >
      <GridItem>
        <Button variant="contained" color="secondary" onClick={handleClose}>cancel</Button>
      </GridItem>
      <GridItem>
        <Button variant="contained" color="primary" type="submit">submit</Button>
      </GridItem>
    </Grid>
  );
};
