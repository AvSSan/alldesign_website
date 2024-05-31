import React, { Component } from 'react';
import { render } from 'react-dom';

import { Pannellum, PannellumVideo } from "pannellum-react";

const PannellumImage = ({url}) => (
  <div>
    <Pannellum
        width="100%"
        height="500px"
        image={url}
        pitch={10}
        yaw={180}
        hfov={110}
        autoLoad
    >
    </Pannellum>
    </div>
);

export default PannellumImage;