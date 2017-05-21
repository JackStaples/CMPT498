## __Edmonton Traffic Data Analysis and Visualization Requirements Document__

The goal of this project is to create a web based tool that uses the traffic data collected by dual loop detectors to analyze, visualize, and clean the data.
It is important that estimation of missing data and malfunctioning systems be reported somehow through the tool.

## __Visualization Requirements__

The following data must be visualized in the tool
 - Location - a map must be used to visualize this
 - Summary statistics (count, average speed, occupancy)
 - Health (of data) status by lane and VDS location 
 - Completeness (percent of VDS lanes that worked properly in terms of volume, speed, and occupancy to total number of VDS lanes) per day per data attribute (volume, speed, occupancy)
 - Erroneous Data should be reported (both missing data, and incorrect data)
 - Weather should be available to be seen for the day the user has selected
 - Old data should be able to be visualized
 
## __Functional Requirements__

The system must follow these technologies
 - Tableau will be used to handle and create the visualizations
 - The tool will be web based
 - The tool must make use of the database structure provided by the city, it should integrate with their system with less than a minutes setup
 - An API should be developped to integrate with the database, so that it is flexible to change in the future
 - The system will send an email at the end of the day with the health of the systems
 
## __Non-Functional Requirements__

The system will aim to follow these criteria
 - The system will update as new data is streamed in
 - The system will aim to be highly modular so that it can scale well into the future
 
