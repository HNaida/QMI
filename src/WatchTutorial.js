import React, { useCallback, useState } from 'react'
import './scroll.css';
import ModalVideo from 'react-modal-video';
import { Resizable, ResizableBox } from 'react-resizable';

const WatchTutorial = ({isOpen, toggleModal}) => {
    const ResizableBox = require('react-resizable').ResizableBox;

    const opts = {
        height: '10',
        width: '20',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <ResizableBox width={400} height={100}>
            <ModalVideo channel='youtube' ratio='2000:10' isOpen={isOpen} opts={opts}  videoId='C1-fRwmvzng' onClose={toggleModal} />
        </ResizableBox>
    )
};

export default WatchTutorial;