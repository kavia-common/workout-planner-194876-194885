import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutList from "./components/WorkoutList";
import {
  clearWorkouts,
  loadWorkoutsOrSeed,
  saveWorkouts,
} from "./utils/storage";

/**
 * Simple unique id generator adequate for local-only lists.
 * (Avoids adding dependencies.)
 */
function createId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// PUBLIC_INTERFACE
function App() {
  /** @type {[import("./types").Workout[], Function]} */
  const [workouts, setWorkouts] = useState([]);
  const [clearStatus, setClearStatus] = useState(null);

  useEffect(() => {
    setWorkouts(loadWorkoutsOrSeed());
  }, []);

  useEffect(() => {
    // Persist any changes (including deletes / clear) to localStorage.
    saveWorkouts(workouts);
  }, [workouts]);

  const workoutCountLabel = useMemo(() => {
    if (workouts.length === 1) return "1 workout";
    return `${workouts.length} workouts`;
  }, [workouts.length]);

  // PUBLIC_INTERFACE
  const handleAddWorkout = (newWorkoutDraft) => {
    const workout = {
      id: createId(),
      exerciseName: newWorkoutDraft.exerciseName.trim(),
      sets: newWorkoutDraft.sets,
      reps: newWorkoutDraft.reps,
      date: newWorkoutDraft.date,
    };

    setWorkouts((prev) => [workout, ...prev]);
  };

  // PUBLIC_INTERFACE
  const handleDeleteWorkout = (id) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  // PUBLIC_INTERFACE
  const handleClearAll = () => {
    setWorkouts([]);
    clearWorkouts();
    setClearStatus("All workouts cleared.");
    window.setTimeout(() => setClearStatus(null), 2500);
  };

  return (
    <div className="App">
      <a className="SkipLink" href="#main">
        Skip to main content
      </a>

      <header className="AppHeader">
        <div className="HeaderInner">
          <div className="HeaderTitleWrap">
            <h1 className="AppTitle">Workout Planner</h1>
            <p className="AppSubtitle">
              Plan your training with quick add, delete, and auto-save.
            </p>
          </div>

          <div className="HeaderMeta" aria-label="Workout summary">
            <span className="Badge" aria-live="polite">
              {workoutCountLabel}
            </span>
            <button
              type="button"
              className="Button ButtonSecondary"
              onClick={handleClearAll}
              disabled={workouts.length === 0}
              aria-disabled={workouts.length === 0}
            >
              Clear All
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="Main">
        <section className="Card" aria-labelledby="add-workout-title">
          <div className="CardHeader">
            <h2 id="add-workout-title" className="CardTitle">
              Add a workout
            </h2>
            <p className="CardHint">
              All fields are required. Sets and reps must be positive integers.
            </p>
          </div>

          <div className="CardBody">
            <WorkoutForm onAddWorkout={handleAddWorkout} />
          </div>
        </section>

        <section className="Card" aria-labelledby="workouts-title">
          <div className="CardHeader CardHeaderRow">
            <div>
              <h2 id="workouts-title" className="CardTitle">
                Your workouts
              </h2>
              <p className="CardHint">
                Tip: refresh the page—your workouts persist via localStorage.
              </p>
            </div>

            {clearStatus ? (
              <div className="InlineNotice" role="status" aria-live="polite">
                {clearStatus}
              </div>
            ) : null}
          </div>

          <div className="CardBody">
            <WorkoutList workouts={workouts} onDeleteWorkout={handleDeleteWorkout} />
          </div>
        </section>

        <footer className="Footer">
          <p className="FooterText">
            Frontend-only demo. No backend calls.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
