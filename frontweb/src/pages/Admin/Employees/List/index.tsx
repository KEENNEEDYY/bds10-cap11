import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { hasAnyRoles } from 'util/auth';
import { Employee } from 'types/employee';
import { SpringPage } from 'types/vendor/spring';
import { useCallback, useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { BASE_URL, requestBackend } from 'util/requests';


type ControlComponentsData = {
  activePage: number;
}

const List = () => {

  const [page, setPage] = useState<SpringPage<Employee>>();

  const [ controlComponentsData, setControlComponentsData ] = useState<ControlComponentsData>({
    activePage:0,
  });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData( {activePage: pageNumber} );
  };

  const getEmployees = useCallback(
    (pageNumber: number) => {
      const params: AxiosRequestConfig = {
        method: 'GET',
        url: `${BASE_URL}/employees`,
        params:{
          page: controlComponentsData.activePage,
          size: 4,
        },
        withCredentials: true,
      }
  
      requestBackend(params)
        .then( response => {
          setPage(response.data);
        });
    } 
    , [controlComponentsData])

  useEffect( () => {
    getEmployees(0);
  }, [getEmployees]);

  return (
    <>

      { hasAnyRoles(['ROLE_ADMIN']) &&
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>                                        
      }


        { page?.content
          .map( (employee) => (
              <EmployeeCard employee={employee} key={employee.id}/>   
            )
          )
        }
      
      <Pagination forcePage={page?.number} onChange={handlePageChange} pageCount={ (page) ? page?.totalPages : 0 } range={3}/>
    </>
  );
};

export default List;
