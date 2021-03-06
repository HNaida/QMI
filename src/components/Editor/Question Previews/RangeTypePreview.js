import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';


const useStyles = makeStyles(theme => ({
    root: {
        width: 300 + theme.spacing(3) * 2,
    },
    margin: {
        height: theme.spacing(3),
    },
}));


const PrettoSlider = withStyles({
    root: {
        color: '#1451af',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);


const RangeTypePreview = ({question, index}) => {
    const classes = useStyles();

    const marks = [];
    const labelsNumber = question.labels.length;
    // Here min, max, step are checked for undefined,
    // as default question from QuestionnaireContext doesn't always initialize these fields
    const min = typeof question.min === "undefined" ? 0 : parseInt(question.min, 10);
    const max = typeof question.max === "undefined" ? 100 : parseInt(question.max, 10);
    const step = typeof question.step === "undefined" ? 1 : parseInt(question.step, 10);
    const labelStep = labelsNumber <= 1 ? 0 : ~~((max - min) / (labelsNumber - 1));
    let pos = labelsNumber === 1 ? ~~((max - min) / 2) : min;

    for (let i = 0; i < labelsNumber; i++) {
        marks.push({
            value: pos,
            label: question.labels[i],
        });
        pos += labelStep;
    }
    return (
        <div className={classes.root} data-cy={"question" + (index + 1)}>
            <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider"
                          defaultValue={0}
                          aria-labelledby="discrete-slider"
                          marks={marks}
                          min={min}
                          max={max}
                          step={step}
                          title={question.title}
                          section_end={question.section_end}
            />
        </div>
    );
};

export default RangeTypePreview
