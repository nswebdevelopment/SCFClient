import React, { useState, useContext } from "react";

export const ModalContext = React.createContext();

export function ExportParcelsModal({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [onSave, setOnSave] = useState(() => () => {});
  const [onCancel, setOnCancel] = useState(() => () => {});
  // const landCoverTypes = ['Forest', 'Grassland', 'Wetland', 'Urban', 'Agriculture'];
  const [parcels, setParcels] = useState([]);
  const [selectedParcels, setSelectedParcels] = useState([]);

  const openExportModal = (parcels, saveCallback, cancelCallback) => {
    setIsOpen(true);
    setOnSave(() => saveCallback);
    setOnCancel(() => cancelCallback);
    setParcels(parcels);
  };

  
  const closeModal = () => {
    setIsOpen(false);
    setOnSave(() => () => {});
    setOnCancel(() => () => {});
    setParcels([]);
    console.log("Modal closed");
  };

  const cancelModal = () => {
    setIsOpen(false);
    onCancel();
    setOnSave(() => () => {});
    setOnCancel(() => () => {});
    setParcels([]);
    console.log("Modal cancelled");
  };

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAllChange = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedParcels(
        Object.keys(parcels).map((key) => parseInt(key, 0))
      );
    } else {
      setSelectedParcels([]);
    }
  };

  return (
    <ModalContext.Provider value={{ openExportModal }}>
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


            <div style={{ marginBottom: "10px" }}>
              <div>
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

              {Object.entries(parcels).map(([key, value]) => (
                <div key={key}>
                  <input
                    type="checkbox"
                    id={key}
                    name={value}
                    value={value}
                    checked={
                      selectAll || selectedParcels.includes(parseInt(key, 0))
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedParcels((prevTypes) => [
                          ...prevTypes,
                          parseInt(key, 0),
                        ]);
                      } else {
                        setSelectedParcels((prevTypes) =>
                          prevTypes.filter((t) => t !== parseInt(key, 0))
                        );
                        setSelectAll(false);
                      }
                    }}
                  />
                  <label htmlFor={value}>{value.name}</label>
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
                    parcels: parcels.filter((parcel, index) =>
                      selectedParcels.includes(index)
                    ),
                  });
                  closeModal();
                }}
              >
                Export
              </button>
              <button onClick={cancelModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useExportModal() {
  return useContext(ModalContext);
}
