import React from "react";

const CertificateTemplate = React.forwardRef(
  ({ winnerName, prize, category, item, team }, ref) => (
    <div
      ref={ref}
      className="w-[1123px] h-[794px] p-10 border-[10px] border-[#335C67] flex flex-col font-serif relative bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: `url('/Certificate.png')`,
      }}
    >
      <div className="font-sans text-[20px] text-[#222] text-left mt-52 ml-16 leading-relaxed w-[90%] max-w-[900px] p-5 rounded-[10px]">
        This is to certify that{" "}
        <b>
          <span className="poppins-bold font-sans text-blue">
            {winnerName}
          </span>
        </b>{" "}
        from team {team} has secured <b>{prize}</b> Place in the {category}{" "}
        {item} in the event held in connection with the Meelad Fest, conducted
        at Manjeshwar from September 15 to 16, 2025.
      </div>
    </div>
  )
);

CertificateTemplate.displayName = "CertificateTemplate";

export default CertificateTemplate;
