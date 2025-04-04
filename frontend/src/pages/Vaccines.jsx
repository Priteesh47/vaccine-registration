import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Vaccines = () => {
  const { speciality } = useParams();
  const [filterVac, setFilterVac] = useState([]);
  const navigate = useNavigate();
  const { vaccines } = useContext(AppContext);

  // Function to handle navigation and avoid repetition
  const handleNavigate = (speciality) => {
    if (speciality === speciality) {
      navigate("/vaccines");
    } else {
      navigate(`/vaccines/${speciality}`);
    }
  };

  // Function to filter vaccines based on speciality
  const applyFilter = () => {
    if (speciality) {
      setFilterVac(vaccines.filter((vac) => vac.speciality === speciality));
    } else {
      setFilterVac(vaccines);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [vaccines, speciality]);

  return (
    <div>
      <p className="text-gray-600">Filters</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {[
          "Covid-19",
          "Monkeypox",
          "Polio",
          "Tetanus",
          "Influenza",
          "Measles",
          "Mumps",
          "Rubella",
          "Diptheria",
          "HPV",
          "Hepatits A",
          "Dengue",
          "Rabies",
          "RSV",
        ].map((item) => (
          <p
            key={item}
            onClick={() => handleNavigate(item)}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === item ? "bg-indigo-100 text-black" : ""
            }`}
          >
            {item}
          </p>
        ))}
      </div>

      <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
        {filterVac.length === 0 ? (
          <p>No vaccines found for the selected speciality</p>
        ) : (
          filterVac.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform duration-300"
              key={index}
            >
              <div className="w-full h-48 bg-blue-50 flex items-center justify-center">
                <img
                  className="w-full h-full object-contain"
                  src={item.image}
                  alt={item.name}
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <p className="text-sm font-medium text-green-700">
                    Available
                  </p>
                </div>
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">{item.dosage}</p>
                <p className="text-sm text-gray-600">{item.speciality}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Vaccines;
