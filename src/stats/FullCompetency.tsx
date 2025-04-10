import React, { useEffect, useState, useContext } from "react";
import api, { configureApi } from "../interceptor/api";
import { AuthContext } from "../auth/AuthContext";

interface EmployeeCompetency {
  
  employeeNumber: string;
  employeeName :string;
  competencyCode: string;
  competencyName:string;
  competencyDescription:string;
  requiredScore:number
  actualScore:number|0
  
}

const EmployeeCompetencyTable: React.FC = () => {
  const [data, setData] = useState<EmployeeCompetency[]>([]);
  const { logout } = useContext(AuthContext)!;
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    configureApi(logout);
  }, [logout]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const competenciesResponse = await api.get("/employee-competencies/details");
        
      
        
        
  
        
        setData(competenciesResponse.data);
      } catch (error) {
        
          console.error("Error fetching data:", error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [logout]);

  const styles = {
    container: {
      maxWidth: "1800px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      marginTop: "80px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
    },
    tableHeader: {
      backgroundColor: "#f5f5f5",
    },
    th: {
      padding: "12px",
      borderBottom: "1px solid #ddd",
      textAlign: "left" as const,
      fontWeight: 500,
    },
    td: {
      border:"1px solid #eee",  
      padding: "12px",
      borderBottom: "1px solid #eee",
    },
    loading: {
      textAlign: "center" as const,
      padding: "20px",
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Employee Competencies</h2>
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th style={styles.th}>S/no</th>
            <th style={styles.th}>Employee Number</th>
            <th style={styles.th}>Employee Name</th>
            <th style={styles.th}>Competency Code</th>
            <th style={styles.th}>Competency Name</th>
            <th style={styles.th}>Required Score</th>
            <th style={styles.th}>Actual Score</th>
            <th style={styles.th}>Gap</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row,index) => (
            <tr key={index}>
              <td style={styles.td}>{index}</td>
              <td style={styles.td}>{row.employeeNumber}</td>
              <td style={styles.td}>{row.employeeName}</td>
              <td style={styles.td}>{row.competencyCode }</td>
              <td style={styles.td}>{row.competencyName}</td>
              <td style={styles.td}>{row.requiredScore}</td>
              <td style={styles.td}>{row.actualScore}</td>
              <td style={{...styles.td,backgroundColor: row.requiredScore - (row.actualScore ?? 0)>0?"#FF746C":""}}>
                {row.requiredScore - (row.actualScore ?? 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeCompetencyTable;