import React from "react";

function formatDate(iso) {
  // Display in a friendly but consistent format.
  // iso is already YYYY-MM-DD; present as such to avoid locale ambiguity.
  return iso;
}

// PUBLIC_INTERFACE
export default function WorkoutItem({ workout, onDelete }) {
  const title = workout.exerciseName;
  const meta = `${workout.sets} sets × ${workout.reps} reps`;

  return (
    <article className="WorkoutItem" aria-label={`Workout: ${title}`}>
      <div className="WorkoutItemMain">
        <h3 className="WorkoutTitle">{title}</h3>
        <dl className="WorkoutMeta">
          <div className="WorkoutMetaRow">
            <dt className="WorkoutMetaKey">Volume</dt>
            <dd className="WorkoutMetaValue">{meta}</dd>
          </div>
          <div className="WorkoutMetaRow">
            <dt className="WorkoutMetaKey">Date</dt>
            <dd className="WorkoutMetaValue">{formatDate(workout.date)}</dd>
          </div>
        </dl>
      </div>

      <div className="WorkoutItemActions">
        <button
          type="button"
          className="Button ButtonDanger"
          onClick={() => onDelete(workout.id)}
          aria-label={`Delete workout: ${title} on ${formatDate(workout.date)}`}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
