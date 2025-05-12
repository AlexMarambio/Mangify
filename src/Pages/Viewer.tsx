const Viewer = () => {
    return (
        <div>
            <iframe
                className="bg-gray-200 w-full h-screen border-0"
                src="../../public/viewer.html?pdfUrl=/armadosMangify.pdf&configUrl=/testConfig.json"
            ></iframe>
        </div>
    );
};

export default Viewer;
