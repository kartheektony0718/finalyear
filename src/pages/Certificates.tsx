import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import Certificate from "@/components/Certificate";

interface Cert {
  _id:string
  course:string
}

const Certificates = () => {

  const { user } = useAuth();

  const [certs,setCerts] = useState<Cert[]>([]);
  const [selected,setSelected] = useState<Cert | null>(null);

  useEffect(()=>{
    fetchCertificates();
  },[]);

  const fetchCertificates = async()=>{

    const res = await axios.get(
      `http://localhost:5000/api/certificates/${user?.id}`
    );

    setCerts(res.data);

  };

  return(

    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold text-red-500 mb-8">
        My Certificates
      </h1>

      {!selected && (

        <div className="grid grid-cols-3 gap-6">

          {certs.map(cert => (

            <div
              key={cert._id}
              onClick={()=>setSelected(cert)}
              className="bg-[#0b0c12] border border-red-900 p-6 rounded-xl cursor-pointer hover:border-red-600 transition"
            >

              <h2 className="text-xl font-bold mb-2">
                {cert.course}
              </h2>

              <p className="text-gray-400">
                Click to view certificate
              </p>

            </div>

          ))}

        </div>

      )}

      {selected && (

        <div>

          <button
            onClick={()=>setSelected(null)}
            className="mb-6 bg-gray-700 px-4 py-2 rounded"
          >
            Back
          </button>

          <Certificate
            name={user?.name || "Student"}
            course={selected.course}
          />

        </div>

      )}

    </div>

  )

}

export default Certificates;