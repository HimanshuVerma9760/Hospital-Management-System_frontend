import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
const Conn = import.meta.env.VITE_CONN_URI;
const FOLDER_PATH = import.meta.env.VITE_FOLDER_URI;

export async function getUser({ signal, userId }) {
  const response = await fetch(`${Conn}/get/user/${userId}`, {
    signal: signal,
  });
  if (response.ok) {
    const result = await response.json();
    if (result) {
      return { src: `${FOLDER_PATH}/uploads/dp/${result.result.dp}` };
    } else {
      console.log("no result");
    }
  } else {
    console.log("Some error occured");
    const error = new Error("Some error occured");
    error.code = response.status;
    error.info = response;
    throw error;
  }
}

export async function getPaginatedDoctors({
  signal,
  page,
  rowsPerPage,
  specialization,
  searchTerm,
}) {
  try {
    const response = await fetch(
      `${Conn}/doctors/get-doctors/?page=${
        page + 1
      }&limit=${rowsPerPage}&specialization=${specialization}&keyword=${searchTerm}`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
      { signal: signal }
    );
    const result = await response.json();
    if (response.ok) {
      console.log("debounced");
      return {
        fetchedDoctors: result.result,
        totalRecords: result.totalRecords,
      };
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    throw new Error("Some error occured");
  }
}

export async function addNewDoctor({ signal, formData }) {
  try {
    const response = await fetch(`${Conn}/doctors/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
      signal: signal,
    });
    if (response) {
      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        const error = new Error(result.message[0] || result.message);
        error.info = result;
        error.code = response.status;
        throw error;
      }
    }
  } catch (error) {
    console.log("error: ", error);
    throw new Error("Server is down, try again later");
  }
}

export async function fetchHospitals({ signal }) {
  const response = await fetch(`${Conn}/hospitals/get-all`, { signal: signal });
  if (response.ok) {
    const result = await response.json();
    return result.result;
  } else {
    console.log("Some error occured");
  }
}
export async function fetchSpecializations({ signal }) {
  const response = await fetch(`${Conn}/specializations`, { signal: signal });
  if (response.ok) {
    const result = await response.json();
    return result.result;
  } else {
    console.log("Some error occured");
  }
}
export async function fetchDiseases({ signal }) {
  const response = await fetch(`${Conn}/diseases`, { signal: signal });
  if (response.ok) {
    const result = await response.json();
    return result.result;
  } else {
    console.log("Some error occured");
  }
}

export async function fetchCities({ signal }) {
  const response = await fetch(`${Conn}/cities`, { signal: signal });
  if (response.ok) {
    const result = await response.json();
    return result.result;
  } else {
    console.log("Some error occured");
  }
}

export async function editExistingDoctorDetails({ signal, reqID, formData }) {
  try {
    const response = await fetch(`${Conn}/doctors/update/${reqID}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
      signal: signal,
    });
    if (response) {
      const result = await response.json();
      if (response.ok) {
      } else {
        const error = new Error(result.message[0] || result.message);
        error.message = result.message;
        error.code = response.status;
        error.info = result;
        throw error;
      }
    }
  } catch (error) {
    console.log("error: ", error);
    error.message = error.message;
    throw error;
  }
}

export async function getAllPaginatedHospitals({
  signal,
  page,
  rowsPerPage,
  searchTerm,
}) {
  try {
    const response = await fetch(
      `${Conn}/hospitals/get/?page=${
        page + 1
      }&limit=${rowsPerPage}&keyword=${searchTerm}`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
      { signal: signal }
    );
    const result = await response.json();
    if (response.ok) {
      return {
        fetchedHospitals: result.result,
        totalRecords: result.totalRecords,
      };
    } else {
      const error = new Error(result.message);
      error.info = result;
      error.code = response.status;
      throw error;
    }
  } catch (error) {
    console.log("error: ", error);
    throw new Error("Some error occured");
  }
}

export async function addNewHospital({ signal, formData }) {
  try {
    const response = await fetch(`${Conn}/hospitals/add`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
      signal: signal,
    });
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const result = await response.json();
      const error = new Error(result.message[0] || result.message);
      error.info = result;
      error.code = response.status;
      throw error;
    }
  } catch (error) {
    console.log("error: ", error);
    throw new Error("Server is down, try again later");
  }
}

export async function editHospital({ signal, formData, reqId }) {
  try {
    const response = await fetch(`${Conn}/hospitals/${reqId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
      signal: signal,
    });
    if (response) {
      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        const error = new Error(result.message[0] || result.message);
        error.message = result.message;
        error.code = response.status;
        error.info = result;
        throw error;
      }
    }
  } catch (error) {
    console.log("error: ", error);
    error.message = error.message;
    throw error;
  }
}

export async function getHospitalById({ signal, reqId }) {
  const response = await fetch(`${Conn}/hospitals/${reqId}`, {
    signal: signal,
  });
  if (response.ok) {
    const result = await response.json();
    return result.hospital;
    // setIsLoading(false);
    // setName(result.hospital.name);
    // setCity(Number(result.hospital.city_id));
    // setLocation(result.hospital.location);
  } else {
    // setIsLoading(false);
    // toast.error("Some error occured");
    console.log("Some error occured");
  }
}

export async function getPaginatedPatients({
  signal,
  page,
  rowsPerPage,
  disease,
  searchTerm,
}) {
  try {
    const response = await fetch(
      `${Conn}/patients/?page=${
        page + 1
      }&limit=${rowsPerPage}&disease=${disease}&keyword=${searchTerm}`,
      { signal: signal }
    );
    const result = await response.json();
    if (response.ok) {
      return {
        fetchedPatients: result.result,
        totalRecords: result.totalRecords,
      };
    } else {
      console.error("Error fetching doctors:", result);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
  setIsLoading(false);
}
