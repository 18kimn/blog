---
title: "Patterns and disparities in U.S. physical distancing"
subtitle: "Evaluating Racial and Socioeconomic Divides During the COVID-19 Pandemic"
author: "Nathan"
date: 2021-01-05
runtime: shiny
output: html_document
---

It goes without saying that distancing is of utmost importance to stopping COVID-19. But how does distancing occur? What areas, what times, and which kinds of people are able to physical distance comapred to others that cannot?

A new [working paper](https://osf.io/e6msz/), from Professor [Emma Zang](http://www.emmazang.net/), [Jessica West](https://www.jessicaswest.com/), myself, and [Christina Pao](https://christina.pao.name/) attempts to provide evidence for these questions by studying a dataset of over 20 million mobile phones throughout the pandemic from SafeGraph, Inc. We explore at a granular level the regional, racial, occupational, educational, and economic class-based differences in physical distancing. 

Our main conclusions support that social conditions can act as barriers to physical distancing -- for example, frontline workers expectedly must continue to work and are unable to stay home in most parts of the country. But this truth is also complicated -- nationwide, Black residents stay home more than White residents, even though we find that this occurs in tandem with the high concentration of Black residents in urban areas that stay home more on the whole. 

To accompany this paper, I produced an interactive map of SafeGraph's metrics aggregated to the state level. Click on each state to find three different metrics of physical distancing: the percent staying completely at home, the median distance traveled by a resident in that state for that day, and the percent commuting to work. Use the slider at the bottom to move the date, viewing how physical distancing increases and decreases throughout the course of the pandemic. Zoom in and out as necessary by scrolling with your mouse. 

<iframe height="800" width="100%" frameborder="no" src= "https://18kimn.shinyapps.io/shiny_safegraph/"> </iframe>

See the [SafeGraph documentation](https://docs.safegraph.com/docs/social-distancing-metrics) for exapnded definitions or [email me](nathan.kim@yale.edu) with questions on this project. 

*Note: please reload the page if the applet freezes.*
