import React, { useState, useContext } from "react";

export const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [onSave, setOnSave] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});

  const [parcelName, setParcelName] = useState("");
  const [parcelDesc, setParcelDesc] = useState("");
  // const landCoverTypes = ['Forest', 'Grassland', 'Wetland', 'Urban', 'Agriculture'];
  const [selectedTypes, setSelectedTypes] = useState([]);

  const { landCoverNames } = require("../utils/constants");

  const openModal = (initialName, initialDesc = '', types = [], saveCallback, cancelCallback) => {
    setIsOpen(true);
    setOnSave(() => saveCallback);
    setOnCancel(() => cancelCallback);
    setParcelName(initialName);
    setParcelDesc(initialDesc);
    setSelectedTypes(types);
    console.log("Modal opened", types);
  };

  
  const closeModal = () => {
    setIsOpen(false);
    setOnSave(() => () => {});
    setOnCancel(() => () => {});
    setSelectedTypes([]);
    console.log("Modal closed");
  };

  const cancelModal = () => {
    setIsOpen(false);
    onCancel();
    setOnSave(() => () => {});
    setOnCancel(() => () => {});
    setSelectedTypes([]);
    console.log("Modal cancelled");
  };

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedTypes(
        Object.keys(landCoverNames).map((key) => parseInt(key, 0))
      );
    } else {
      setSelectedTypes([]);
    }
  };

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
        
            }}
          >
            <input
              type="text"
              placeholder="Parcel name"
              value={parcelName}
              id="parcelName"
              style={{ marginBottom: "10px" }}
              onChange={(e) => setParcelName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Parcel description"
              value={parcelDesc}
              id="parcelDescription"
              style={{ marginBottom: "20px" }}
              onChange={(e) => setParcelDesc(e.target.value)}
            />

            <div style={{ marginBottom: "10px" }}>
            <div  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                <input
                  type="checkbox"
                  id="all"
                  name="all"
                  value="all"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <label htmlFor="all">All</label>
              </div>

              {Object.entries(landCoverNames).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <input
                    type="checkbox"
                    id={key}
                    name={value}
                    value={value}
                    checked={
                      selectAll || selectedTypes.includes(parseInt(key, 0))
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTypes((prevTypes) => [
                          ...prevTypes,
                          parseInt(key, 0),
                        ]);
                      } else {
                        setSelectedTypes((prevTypes) =>
                          prevTypes.filter((t) => t !== parseInt(key, 0))
                        );
                        setSelectAll(false);
                      }
                    }}
                  />
                  <label htmlFor={value}>{value}</label>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <button
         
                onClick={() => {
                  onSave({
                    name: document.getElementById("parcelName").value,
                    desc: document.getElementById("parcelDescription").value,
                    selectedTypes: selectedTypes,
                  });
                  closeModal();
                }}
              >
                Save
              </button>
              <button onClick={cancelModal}>Cancel</button>

            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
