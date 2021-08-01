/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { forwardRef } from 'react'
import { Grid } from '@material-ui/core'

/* Helper functions to enhance readability since with Material UI a row is '<Grid container>' and a column is '<Grid item>' */

export const Row = forwardRef(
  (props, ref) =>
    <Grid container {...props} ref={ref}>
      {props.children}
    </Grid>
)

export const Col = forwardRef(
  (props, ref) =>
    <Grid item {...props} ref={ref}>
      {props.children}
    </Grid>
)