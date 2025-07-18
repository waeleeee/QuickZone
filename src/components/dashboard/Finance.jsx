import React, { useState, useEffect } from "react";
import DataTable from "./common/DataTable";
import Modal from "./common/Modal";
import { apiService } from "../../services/api";

// List of Tunisian governorates
const gouvernorats = [
  "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", 
  "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine", 
  "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", 
  "Tozeur", "Tunis", "Zaghouan"
];



const titreOptions = [
  { value: "comptable", label: "Comptable" },
  { value: "senior comptable", label: "Senior comptable" },
  { value: "directeur comptable", label: "Directeur comptable" },
];

const agenceOptions = [
  { value: "Siège", label: "Siège" },
  { value: "Tunis", label: "Tunis" },
  { value: "Sousse", label: "Sousse" },
  { value: "Sfax", label: "Sfax" },
];

const Finance = () => {
  const [comptables, setComptables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editComptable, setEditComptable] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch comptables from backend
  useEffect(() => {
    const fetchComptables = async () => {
      try {
        setLoading(true);
        const data = await apiService.getComptables();
        console.log('Comptables data:', data);
        setComptables(data || []);
      } catch (error) {
        console.error('Error fetching comptables:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComptables();
  }, []);

  const handleAddComptable = () => {
    setEditComptable({
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      title: 'comptable',
      agency: 'Siège',
      governorate: 'Tunis',
    });
    setShowEditModal(true);
  };

  const handleEditComptable = (comptable) => {
    setEditComptable({ ...comptable });
    setShowEditModal(true);
  };

  const handleSaveComptable = async (e) => {
    e.preventDefault();
    try {
      if (editComptable.id && comptables.some(c => c.id === editComptable.id)) {
        // Update existing comptable
        const result = await apiService.updateComptable(editComptable.id, editComptable);
        if (result && result.success) {
          setComptables(comptables.map(c => c.id === editComptable.id ? result.data : c));
          alert('Comptable mis à jour avec succès!');
        }
      } else {
        // Create new comptable
        const result = await apiService.createComptable(editComptable);
        if (result && result.success) {
          setComptables([...comptables, result.data]);
          alert('Comptable créé avec succès!');
        }
      }
      setShowEditModal(false);
      setEditComptable(null);
    } catch (error) {
      console.error('Error saving comptable:', error);
      const errorMessage = error.message || 'Error saving comptable. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDeleteComptable = async (comptable) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le comptable "${comptable.name}" ?`)) {
      try {
        const result = await apiService.deleteComptable(comptable.id);
        if (result && result.success) {
          setComptables(comptables.filter(c => c.id !== comptable.id));
          alert('Comptable supprimé avec succès!');
        }
      } catch (error) {
        console.error('Error deleting comptable:', error);
        const errorMessage = error.message || 'Error deleting comptable. Please try again.';
        alert(errorMessage);
      }
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Nom et prénom" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Téléphone" },
    { key: "governorate", header: "Gouvernorat" },
    { key: "address", header: "Adresse" },
    { key: "title", header: "Titre", render: value => titreOptions.find(o => o.value === value)?.label || value },
    { key: "agency", header: "Agence" },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditComptable(row)}
            className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50 transition-colors"
            title="Modifier"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteComptable(row)}
            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
            title="Supprimer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  const filteredComptables = comptables.filter(c =>
    Object.values(c).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestion des comptables</h1>
          <p className="text-gray-600 mt-1">Gérez les comptables et leurs informations</p>
        </div>
        <button
          onClick={handleAddComptable}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Ajouter Comptable
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="animate-pulse p-8">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <DataTable
            data={filteredComptables}
            columns={columns}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showActions={false}
          />
        )}
      </div>
      {/* Modal for Add/Edit Comptable */}
      {showEditModal && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} size="md">
          <form onSubmit={handleSaveComptable} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-left">ID</label>
                <input type="text" className="border rounded px-2 py-1 w-full bg-gray-100" value={editComptable.id || ''} readOnly disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-left">Nom et prénom</label>
                <input type="text" className="border rounded px-2 py-1 w-full" value={editComptable.name || ''} onChange={e => setEditComptable({ ...editComptable, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-left">Email</label>
                <input type="email" className="border rounded px-2 py-1 w-full" value={editComptable.email || ''} onChange={e => setEditComptable({ ...editComptable, email: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-left">Téléphone</label>
                <input type="text" className="border rounded px-2 py-1 w-full" value={editComptable.phone || ''} onChange={e => setEditComptable({ ...editComptable, phone: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-left">Gouvernorat</label>
                <select className="border rounded px-2 py-1 w-full" value={editComptable.governorate || 'Tunis'} onChange={e => setEditComptable({ ...editComptable, governorate: e.target.value })} required>
                  {gouvernorats.map(gov => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-left">Adresse</label>
                <input type="text" className="border rounded px-2 py-1 w-full" value={editComptable.address || ''} onChange={e => setEditComptable({ ...editComptable, address: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-left">Titre</label>
                <select className="border rounded px-2 py-1 w-full" value={editComptable.title || 'comptable'} onChange={e => setEditComptable({ ...editComptable, title: e.target.value })} required>
                  {titreOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-left">Agence</label>
                <select className="border rounded px-2 py-1 w-full" value={editComptable.agency || 'Siège'} onChange={e => setEditComptable({ ...editComptable, agency: e.target.value })} required>
                  {agenceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowEditModal(false)}>Annuler</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Finance; 