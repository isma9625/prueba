import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { registro } from '../../services/servicio-laravel.service';
import { AxiosError } from 'axios';
import './registrostyle.css';

interface FormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Registro: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: "onBlur" });

  const onSubmit = async (data: FormData) => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await registro(data);
      console.log("Registro exitoso:", response.data);
      setSuccessMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
      window.location.href = '/login';
    } catch (error) {
      console.error("Error al registrar:", error);
      if (error instanceof AxiosError && error.response?.data) {
        setErrorMessage("Datos incorrectos. Por favor, revisa tus datos o inténtalo más tarde.");
      } else {
        setErrorMessage("Hubo un problema al registrarse. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <section className="vh-100 d-flex align-items-center justify-content-center bgPokeballImg">
      <div className="row justify-content-center w-100 position-relative">
        <div className="card col-11 col-md-9 col-lg-8 mx-auto shadow-lg border-0 rounded-4 overflow-hidden fondoAzul position-relative registro-card">
          <div className="fondoNegroDiagonal"></div>

          <div className="card-body px-4 py-5 d-flex flex-column justify-content-center h-100 position-relative">
            <div className="row h-100">
              <div className="col-md-6 d-flex justify-content-center align-items-center text-white text-start">
                <div>
                  <h3 className="fw-bold">¡Bienvenido a <br /> Pokémon Battle!</h3>
                  <h6>Regístrate para jugar. <br /> Esperamos que tengas una <br /> grata experiencia.</h6>
                </div>
              </div>

              <div className="col-md-6 d-flex align-items-center">
                <div className="w-100 px-md-5 px-3 text-white">
                  <h2 className="card-title text-center mb-4 fw-bold textColorYellowReact">Registro</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>

                    {/* Nombre */}
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">Nombre:</label>
                      <input type="text" id="name" className="form-control" {...register("name", {
                        required: "El nombre es obligatorio",
                        pattern: {
                          value: /^[a-zA-Z]+$/,
                          message: "Solo se permiten letras sin espacios",
                        }
                      })} />
                      {errors.name && <p className="text-danger small mt-1"><i className="fas fa-exclamation-circle"></i> {errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">Email:</label>
                      <input type="email" id="email" className="form-control" {...register("email", {
                        required: "El email es obligatorio",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "El email tiene un formato inválido",
                        }
                      })} />
                      {errors.email && <p className="text-danger small mt-1"><i className="fas fa-exclamation-circle"></i> {errors.email.message}</p>}
                    </div>

                    {/* Contraseña */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">Contraseña:</label>
                      <input type="password" id="password" className="form-control" {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: {
                          value: 6,
                          message: "La contraseña debe tener al menos 6 caracteres",
                        },
                        pattern: {
                          value: /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/,
                          message: "Debe contener al menos una mayúscula y un carácter especial",
                        }
                      })} />
                      {errors.password && <p className="text-danger small mt-1"><i className="fas fa-exclamation-circle"></i> {errors.password.message}</p>}
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="mb-3">
                      <label htmlFor="password_confirmation" className="form-label fw-semibold">Repetir Contraseña:</label>
                      <input type="password" id="password_confirmation" className="form-control" {...register("password_confirmation", {
                        required: "Debes confirmar la contraseña",
                        validate: (value, formValues) =>
                          value === formValues.password || "Las contraseñas no coinciden",
                      })} />
                      {errors.password_confirmation && <p className="text-danger small mt-1"><i className="fas fa-exclamation-circle"></i> {errors.password_confirmation.message}</p>}
                    </div>

                    {/* Botón */}
                    <div className="d-grid">
                      <button type="submit" className="btn btn-lg bgColorBlack textColorYellowReact border-2 borderYellowReact rounded btnScaleReact" disabled={!isValid}>
                        <i className="fas fa-user-plus"></i> Registrarse
                      </button>
                    </div>

                    {/* Mensajes */}
                    <div className="mt-3 text-center">
                      {errorMessage && <p className="text-danger">{errorMessage}</p>}
                      {successMessage && <p className="text-success">{successMessage}</p>}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registro;
