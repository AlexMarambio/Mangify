const Viewer = () => {
    return (
        <iframe
            src="../../public/viewer.html?pdfUrl=/armadosMangify.pdf&configUrl=/testConfig.json"
            style={{
                width: '100%',
                height: '860px',
                border: 'none',
                backgroundColor: 'brown'
            }}
        ></iframe>
    )
}
export default Viewer