import React, { useId, useMemo, useState } from "react";

function isPositiveIntegerString(value) {
  // Allows typing; validation enforced on submit.
  return /^\d+$/.test(value) && Number(value) > 0;
}

function isValidDateYYYYMMDD(value) {
  if (!value) return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  return d.toISOString().slice(0, 10) === value;
}

function validate(values) {
  const errors = {};

  if (!values.exerciseName.trim()) {
    errors.exerciseName = "Exercise name is required.";
  }

  if (!values.sets) {
    errors.sets = "Sets is required.";
  } else if (!isPositiveIntegerString(values.sets)) {
    errors.sets = "Sets must be a positive integer.";
  }

  if (!values.reps) {
    errors.reps = "Reps is required.";
  } else if (!isPositiveIntegerString(values.reps)) {
    errors.reps = "Reps must be a positive integer.";
  }

  if (!values.date) {
    errors.date = "Date is required.";
  } else if (!isValidDateYYYYMMDD(values.date)) {
    errors.date = "Please enter a valid date.";
  }

  return errors;
}

// PUBLIC_INTERFACE
export default function WorkoutForm({ onAddWorkout }) {
  /** Controlled form values */
  const [values, setValues] = useState({
    exerciseName: "",
    sets: "",
    reps: "",
    date: "",
  });

  /** Field-level errors shown after submit attempt */
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const formErrorId = useId();
  const exerciseErrorId = useId();
  const setsErrorId = useId();
  const repsErrorId = useId();
  const dateErrorId = useId();

  const hasAnyError = useMemo(
    () => Object.keys(errors).length > 0,
    [errors]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({
      exerciseName: true,
      sets: true,
      reps: true,
      date: true,
    });

    if (Object.keys(nextErrors).length > 0) return;

    onAddWorkout({
      exerciseName: values.exerciseName,
      sets: Number(values.sets),
      reps: Number(values.reps),
      date: values.date,
    });

    setValues({
      exerciseName: "",
      sets: "",
      reps: "",
      date: "",
    });
    setErrors({});
    setTouched({});
  };

  return (
    <form className="Form" onSubmit={handleSubmit} noValidate>
      {hasAnyError ? (
        <div className="FormAlert" role="alert" id={formErrorId}>
          Please fix the highlighted fields.
        </div>
      ) : null}

      <div className="FormGrid" role="group" aria-label="Workout details">
        <div className="Field">
          <label className="Label" htmlFor="exerciseName">
            Exercise name
          </label>
          <input
            className={`Input ${
              touched.exerciseName && errors.exerciseName ? "InputError" : ""
            }`}
            id="exerciseName"
            name="exerciseName"
            type="text"
            value={values.exerciseName}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            aria-invalid={Boolean(touched.exerciseName && errors.exerciseName)}
            aria-describedby={
              touched.exerciseName && errors.exerciseName ? exerciseErrorId : undefined
            }
            placeholder="e.g., Bench Press"
          />
          {touched.exerciseName && errors.exerciseName ? (
            <p className="FieldError" id={exerciseErrorId}>
              {errors.exerciseName}
            </p>
          ) : null}
        </div>

        <div className="Field">
          <label className="Label" htmlFor="sets">
            Sets
          </label>
          <input
            className={`Input ${touched.sets && errors.sets ? "InputError" : ""}`}
            id="sets"
            name="sets"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={values.sets}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.sets && errors.sets)}
            aria-describedby={touched.sets && errors.sets ? setsErrorId : undefined}
            placeholder="3"
          />
          {touched.sets && errors.sets ? (
            <p className="FieldError" id={setsErrorId}>
              {errors.sets}
            </p>
          ) : null}
        </div>

        <div className="Field">
          <label className="Label" htmlFor="reps">
            Reps
          </label>
          <input
            className={`Input ${touched.reps && errors.reps ? "InputError" : ""}`}
            id="reps"
            name="reps"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={values.reps}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.reps && errors.reps)}
            aria-describedby={touched.reps && errors.reps ? repsErrorId : undefined}
            placeholder="8"
          />
          {touched.reps && errors.reps ? (
            <p className="FieldError" id={repsErrorId}>
              {errors.reps}
            </p>
          ) : null}
        </div>

        <div className="Field">
          <label className="Label" htmlFor="date">
            Date
          </label>
          <input
            className={`Input ${touched.date && errors.date ? "InputError" : ""}`}
            id="date"
            name="date"
            type="date"
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(touched.date && errors.date)}
            aria-describedby={touched.date && errors.date ? dateErrorId : undefined}
          />
          {touched.date && errors.date ? (
            <p className="FieldError" id={dateErrorId}>
              {errors.date}
            </p>
          ) : null}
        </div>
      </div>

      <div className="FormActions">
        <button type="submit" className="Button ButtonPrimary">
          Add Workout
        </button>
      </div>
    </form>
  );
}
