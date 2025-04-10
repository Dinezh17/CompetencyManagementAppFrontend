import React, { useState, useEffect, useContext } from "react";
import api, { configureApi } from "../interceptor/api";
import { AuthContext } from "../auth/AuthContext";

interface Role {
  id: number;
  role_code: string;
  name: string;
}
interface RoleCrud {
  role_code: string;
  name: string;
}
const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<RoleCrud>({
    role_code: '',
    name: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { logout } = useContext(AuthContext)!;

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles");
      setRoles(response.data);
    } catch (error:any) {
      alert("Failed"+" " + error?.response?.data?.detail )

        console.error("Error fetching roles:", error);
      
    }
  };

 
  useEffect(() => {
    configureApi(logout);
  }, [logout]);

  useEffect(() => {
     fetchRoles();
  }, [logout]);

  const handleSubmit = async () => {
    if (!formData.role_code.trim() || !formData.name.trim()) {
      alert("Role code and name are required!");
      return;
    }

    try {

      if (editingId) {
        await api.put(`/roles/${editingId}`, formData);
        fetchRoles();
      } else {
        await api.post("/roles", formData);
        fetchRoles();
      }
      closeModal();
    } catch (error:any) {

      alert("Failed"+" " + error?.response?.data?.detail )

        console.error("Error saving role:", error);
      
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this role?")) {
      try {
        await api.delete(`/roles/${id}`);
        fetchRoles();
      } catch (error:any) {
        alert("Failed"+" " + error?.response?.data?.detail )

        console.error("Error deleting role:", error);
        
      }
    }
  };

  const openModal = (role?: Role) => {
    if (role) {
      setEditingId(role.id);
      setFormData({
        role_code: role.role_code,
        name: role.name
      });
    } else {
      setEditingId(null);
      setFormData({ role_code: '', name: '' });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Styles with proper TypeScript types
  const styles = {
    container: {
      maxWidth: '1500px',
      margin: '20px auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      marginTop: '80px' // Added to account for navbar
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    table: {
      border: '1px solid #ddd' ,
      width: '100%',
      borderCollapse: 'collapse' as const,
      marginTop: '10px'
    },
    tableHeader: {
      border: '1px solid #ddd' ,
      backgroundColor: '#f5f5f5'
    },
    th: {
      border: '1px solid #ddd' ,
      padding: '12px',
      borderBottom: '1px solid #ddd',
      textAlign: 'left' as const,
      fontWeight: 500
    },
    td: {
      border: '1px solid #ddd' ,
      padding: '12px',
      borderBottom: '1px solid #eee'
    },
    button: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      marginRight: '8px'
    },
    modalOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '400px',
      maxWidth: '90%'
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '8px 0',
      border: '1px solid #ddd',
      borderRadius: '4px',
      boxSizing: 'border-box' as const
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Role Management</h2>
        <button 
          style={{ ...styles.button, backgroundColor: '#4CAF50', color: 'white' }}
          onClick={() => openModal()}
        >
          + Add Role
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Role Code</th>
            <th style={styles.th}>Role Name</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td style={styles.td}>{role.id}</td>
              <td style={styles.td}>{role.role_code}</td>
              <td style={styles.td}>{role.name}</td>
              <td style={styles.td}>
                <button
                  style={{ ...styles.button, backgroundColor: '#2196F3', color: 'white' }}
                  onClick={() => openModal(role)}
                >
                  Edit
                </button>
                <button
                  style={{ ...styles.button, backgroundColor: '#f44336', color: 'white' }}
                  onClick={() => handleDelete(role.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>{editingId ? "Edit Role" : "Add Role"}</h3>
            
            <input
              type="text"
              name="role_code"
              placeholder="Role code"
              value={formData.role_code}
              onChange={handleInputChange}
              style={{ ...styles.input, backgroundColor: editingId ? '#f5f5f5' : 'white' }}
              readOnly={!!editingId}
            />
            
            <input
              type="text"
              name="name"
              placeholder="Role name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
            />
            
            <div style={styles.modalFooter}>
              <button 
                style={{ ...styles.button, backgroundColor: '#4CAF50', color: 'white' }}
                onClick={handleSubmit}
              >
                Save
              </button>
              <button 
                style={{ ...styles.button, backgroundColor: '#f5f5f5' }}
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;