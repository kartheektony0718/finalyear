import html2canvas from "html2canvas";
import { useRef } from "react";

interface Props {
  name: string;
  course: string;
}

const Certificate = ({ name, course }: Props) => {

  const ref = useRef<HTMLDivElement>(null);

  const certificateId =
    "SN-" + Math.floor(100000 + Math.random() * 900000);

  const date = new Date().toLocaleDateString();

  const download = async () => {

    if (!ref.current) return;

    const canvas = await html2canvas(ref.current);

    const link = document.createElement("a");

    link.download = `${name}-certificate.jpg`;

    link.href = canvas.toDataURL("image/jpeg");

    link.click();

  };

  return (

    <div className="flex flex-col items-center mt-10">

      <div
        ref={ref}
        className="w-[900px] h-[500px] bg-[#0b0c12] border-4 border-red-700 rounded-xl p-10 text-white"
      >

        <div className="flex justify-between mb-6">

          <h2 className="text-xl font-bold text-red-500">
            SkillNect
          </h2>

          <p className="text-sm text-gray-400">
            Certificate ID: {certificateId}
          </p>

        </div>

        <h1 className="text-4xl font-bold text-center mb-6 text-red-500">
          Certificate of Completion
        </h1>

        <p className="text-center text-lg mb-6">
          This certifies that
        </p>

        <h2 className="text-3xl font-bold text-center mb-6">
          {name}
        </h2>

        <p className="text-center text-lg mb-6">
          has successfully completed the roadmap
        </p>

        <h3 className="text-2xl text-center text-red-400 font-semibold">
          {course}
        </h3>

        <div className="flex justify-between mt-16">

          <div>

            <p className="text-sm text-gray-400">
              Date
            </p>

            <p className="font-semibold">
              {date}
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-gray-400">
              Authorized by
            </p>

            <p className="font-semibold">
              SkillNect Learning Platform
            </p>

          </div>

        </div>

      </div>

      <button
        onClick={download}
        className="mt-6 bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700"
      >
        Download Certificate
      </button>

    </div>

  );

};

export default Certificate;