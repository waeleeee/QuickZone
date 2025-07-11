import React, { useState } from "react";
import DataTable from "./common/DataTable";
import Modal from "./common/Modal";

const Secteurs = () => {
  const [sectors, setSectors] = useState([
    {
      id: "SEC001",
      name: "Secteur Nord",
      city: ["Paris", "Lyon"],
      manager: "Pierre Dubois",
      status: "Actif",
    },
    {
      id: "SEC002",
      name: "Secteur Sud",
      city: ["Marseille", "Toulouse"],
      manager: "Sarah Ahmed",
      status: "Actif",
    },
    {
      id: "SEC003",
      name: "Secteur Est",
      city: ["Nice", "Nantes"],
      manager: "Mohamed Ali",
      status: "Inactif",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    city: [],
    manager: "",
    status: "Actif",
  });

  // List of chef d'agence (should match ChefAgence.jsx)
  const chefAgenceList = [
    "Amine Gharbi",
    "Sonia Ben Salah"
  ];

  const columns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Nom du secteur" },
    { key: "city", header: "Ville", render: (value) => Array.isArray(value) ? value.join(", ") : value },
    { key: "manager", header: "Responsable" },
    {
      key: "status",
      header: "Statut",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === "Actif"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingSector(null);
    setFormData({
      name: "",
      city: [],
      manager: "",
      status: "Actif",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (sector) => {
    setEditingSector(sector);
    setFormData(sector);
    setIsModalOpen(true);
  };

  const handleDelete = (sector) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce secteur ?")) {
      setSectors(sectors.filter((s) => s.id !== sector.id));
    }
  };

  const handleSubmit = () => {
    if (editingSector) {
      setSectors(
        sectors.map((sector) =>
          sector.id === editingSector.id ? { ...formData, id: sector.id } : sector
        )
      );
    } else {
      const newSector = {
        ...formData,
        id: `SEC${String(sectors.length + 1).padStart(3, '0')}`,
      };
      setSectors([...sectors, newSector]);
    }
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header harmonisé */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des secteurs</h1>
          <p className="text-gray-600 mt-1">Gérez les secteurs de livraison et leurs responsables</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Ajouter un secteur
        </button>
      </div>

      {/* Tableau des secteurs */}
      <DataTable
        data={sectors}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Modal d'ajout/édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSector ? "Modifier le secteur" : "Ajouter un secteur"}
        size="md"
      >
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-left">Nom du secteur</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-left">Gouvernorat(s)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Ariana","Béja","Ben Arous","Bizerte","Gabès","Gafsa","Jendouba","Kairouan","Kasserine","Kebili","Kef","Mahdia","Manouba","Médenine","Monastir","Nabeul","Sfax","Sidi Bouzid","Siliana","Sousse","Tataouine","Tozeur","Tunis","Zaghouan"].map(gouv => (
                  <label key={gouv} className="flex items-center gap-2 text-sm font-normal text-gray-700 text-left">
                    <input
                      type="checkbox"
                      value={gouv}
                      checked={formData.city.includes(gouv)}
                      onChange={e => {
                        const checked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          city: checked
                            ? [...prev.city, gouv]
                            : prev.city.filter(c => c !== gouv)
                        }));
                      }}
                    />
                    {gouv}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-left">Responsable</label>
              <select name="manager" value={formData.manager} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Sélectionner un responsable</option>
                {chefAgenceList.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-left">Statut</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Annuler</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">{editingSector ? "Mettre à jour" : "Ajouter"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Secteurs; 