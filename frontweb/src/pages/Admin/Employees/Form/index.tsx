import history from 'util/history';
import {Employee} from 'types/employee';
import './styles.css';
import { Controller, useForm } from 'react-hook-form';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { Department } from 'types/department';

const Form = () => {

  const { register, handleSubmit, control, formState : {errors} } = useForm<Employee>();

  const [selectDepartmanet, setSelectDepartment] = useState<Department[]>();

  useEffect( () => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/departments',
      withCredentials: true
    }
    requestBackend(config)
      .then((response) => {
        setSelectDepartment(response.data);
      })
  }, [])

  const handleCancel = () => {
    history.push('/admin/employees');
  };

  const onSubmit = (employee: Employee) => {
    const data = {...employee};
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: "/employees",
      data,
      withCredentials: true,
    };
    requestBackend(config).then( (response) => {
      toast.info("Cadastrado com sucesso");
      history.push('/admin/employees');
    }).catch( () => {
      toast.error("Erro ao cadastrar");
    })
  }

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form  onSubmit={handleSubmit(onSubmit)} >
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">

              <div className="margin-bottom-30">
                <input {...register('name', { required: 'Campo obrigatório'})}
                  type="text" name="name" data-testid="name"
                  placeholder="Nome" 
                  className={`form-control base-input ${ errors.name ? 'is-invalid': '' } `}
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <input {...register('email', {required: 'Campo obrigatório', 
                  pattern: { value:  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email inválido', }
                  })}
                   type="text" name="email" data-testid="email"
                  placeholder="Email"
                  className={`form-control base-input ${ errors.email ? 'is-invalid':''}`}
                />                
                  <div className="invalid-feedback d-block">{errors.email?.message}</div>
              </div>
              
              <div className="margin-bottom-30">
                <label htmlFor="department" className="d-none">Departamento</label>
                <Controller name='department' rules={ {required: true} }  control={control} 
                  render={ ( {field} ) => (
                  <Select {...field}
                    options={selectDepartmanet} classNamePrefix={"employee-crud-select"}
                    getOptionLabel={ (department: Department) => department.name }
                    getOptionValue={ (department: Department) => String(department.id)}
                    inputId="department"
                  />
                 ) 
                }
                />
                 {errors.department && (
                    <div className="invalid-feedback d-block"> Campo obrigatório </div>
                  )}               
              </div>

            </div>
          </div>

          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
