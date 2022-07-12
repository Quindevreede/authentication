import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function SignUp() {
  const { handleSubmit, register } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <>
      <h1>Registreren</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur atque consectetur, dolore eaque eligendi
        harum, numquam, placeat quisquam repellat rerum suscipit ullam vitae. A ab ad assumenda, consequuntur deserunt
        doloremque ea eveniet facere fuga illum in numquam quia reiciendis rem sequi tenetur veniam?</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email-field">
          Email:
          <input
            type="email"
            id="email-field"
            {...register("email")}
          />
        </label>

        <label htmlFor="username-field">
          Gebruikersnaam:
          <input
            type="text"
            id="username-field"
            {...register("username")}
          />
        </label>

        <label htmlFor="password-field">
          Wachtwoord:
          <input
            type="password"
            id="password-field"
            {...register("password")}
          />
        </label>
        <button
          type="submit"
          className="form-button"
        >
          Maak account aan
        </button>
      </form>
      <p>Heb je al een account? Je kunt je <Link to="/signin">hier</Link> inloggen.</p>
    </>
  );
}

export default SignUp;