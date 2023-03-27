import React, { useState, useEffect } from "react";

function VehicleManufacturerCatalog() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("All");

  useEffect(() => {
    fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?&format=json"
    )
      .then((response) => response.json())
      .then((data) => setData(data.Results));
  }, []);

  const filterTable = () => {
    return data.filter((dataRow) => {
      // Check if dataRow matches search term
      if (
        searchTerm &&
        Object.keys(dataRow).some((columnKey) => {
          // Check if column value includes search term
          if (dataRow[columnKey]) {
            return dataRow[columnKey]
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }
          return false;
        })
      ) {
        return true;
      }

      // Check if dataRow matches selected vehicle type
      if (
        selectedVehicleType &&
        selectedVehicleType !== "All" &&
        dataRow["VehicleTypeName"] &&
        dataRow["VehicleTypeName"].toLowerCase() ===
          selectedVehicleType.toLowerCase()
      ) {
        return true;
      }

      return false;
    });
  };

  const handleRowClick = (dataRow) => {
    // Get manufacturer ID from dataRow
    const manufacturerId = dataRow["Mfr_ID"];

    // Fetch manufacturer details
    fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetManufacturerDetails/${manufacturerId}?format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        // Display manufacturer details in popup
        alert(`Manufacturer's Registered Name: ${data.Results[0].Mfr_Name}
Current Head: ${data.Results[0].Principal_Place_of_Business} (${data.Results[0].Mfr_CommonName})
Address: ${data.Results[0].Mfr_Address}
State: ${data.Results[0].Mfr_State}`);
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Vehicle Manufacturer Catalog</h1>
      <input
        type="text"
        placeholder="Search by company name, country or type"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <select
        value={selectedVehicleType}
        onChange={(event) => setSelectedVehicleType(event.target.value)}
      >
        <option value="All">All</option>
        {Array.from(
          new Set(data.map((dataRow) => dataRow["VehicleTypeName"]))
        ).map((vehicleType) => (
          <option key={vehicleType} value={vehicleType}>
            {vehicleType}
          </option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {filterTable().map((dataRow) => (
            <tr
              key={dataRow.Mfr_ID}
              onClick={() => handleRowClick(dataRow)}
              style={{ cursor: "pointer" }}
            >
              <td>{dataRow.Mfr_Name}</td>
              <td>{dataRow.Country}</td>
              <td>
                {" "}
                {Object.values(dataRow.VehicleTypes)
                  .map((vehicleType) => vehicleType.Name)
                  .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleManufacturerCatalog;
