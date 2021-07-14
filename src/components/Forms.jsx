import PackageForm from "./PackageForm";
import DistanceForm from "./DistanceForm";

function Forms() {

    return (
        <div className="flex flex-col md:flex-row items-center justify-center">
            <PackageForm/>
            <DistanceForm/>
        </div>
    )
}

export default Forms;