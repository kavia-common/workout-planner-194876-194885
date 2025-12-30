import React from "react";
import WorkoutItem from "./WorkoutItem";

// PUBLIC_INTERFACE
export default function WorkoutList({ workouts, onDeleteWorkout }) {
  if (!workouts || workouts.length === 0) {
    return (
      <div className="EmptyState" role="status" aria-live="polite">
        <h3 className="EmptyTitle">No workouts yet</h3>
        <p className="EmptyText">Add your first workout using the form above.</p>
      </div>
    );
  }

  return (
    <ul className="WorkoutList" aria-label="Workout list">
      {workouts.map((workout) => (
        <li key={workout.id} className="WorkoutListItem">
          <WorkoutItem workout={workout} onDelete={onDeleteWorkout} />
        </li>
      ))}
    </ul>
  );
}
