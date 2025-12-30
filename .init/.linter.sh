#!/bin/bash
cd /home/kavia/workspace/code-generation/workout-planner-194876-194885/workout_planner_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

