import ICON1 from '../icon1.png';
import ICON2 from '../icon2.png'
import {
    BrowserView,
    MobileView,
    isMobile,
} from "react-device-detect";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

export default function Home(props) {
    let history = useHistory();
    const [filter, setFilter] = useState({
        page: 1,
    })
    const [load, showLoad] = useState(false)
    const [info, setInfo] = useState(false);
    const [collapse, setCollapse] = useState(false)
    const [sizePerPage, setSizePerPage] = useState(5);
    const [page, setPage] = useState(1)
    const [dataReport, setDataReport] = useState([]);
    const [dataCode, setDataCode] = useState({});
    const [dataDepartment, setDataDepartment] = useState([]);

    const Authorization = JSON.parse(
        sessionStorage.getItem("TOKEN")
    )
    const HEADER = {
        'Content-Type': 'multipart/form-data',
        'Authorization': Authorization,
    }
    const fetchReport = async () => {
        showLoad(true)
        const URL = 'https://qlsc.maysoft.io/server/api/getAllReports'
        const DATA = filter;
        const result = await axios.post(URL, DATA, { headers: HEADER })
        setDataReport(result.data.data.data);
        showLoad(false)
    }
    const fetchCode = async () => {
        const URL = 'https://qlsc.maysoft.io/server/api/getCommon'
        const DATA = { groups: "incidentObject, reportStatus, reportType" };
        const result = await axios.post(URL, DATA, { headers: HEADER });
        setDataCode(result.data.data);
    }
    const fetchDepartment = async () => {
        const URL = 'https://qlsc.maysoft.io/server/api/getAllDepartments'
        const DATA = null;
        const result = await axios.post(URL, DATA, { headers: HEADER });
        setDataCode(result.data.data.data);
    }
    useEffect(() => {
        fetchReport();
        fetchCode();
        fetchDepartment();
    }, [])
    const setParam = () => {
        const {
            departmentId,
            status,
            reportType,
            incidentObject,
            searchKey,
            reportTime,
        } = filter;

        let currentPage = `page=${page}`;
        let department = `&department=${departmentId}`;
        let reportStatus = `&status=${status}`;
        let type = `&type=${reportType}`;
        let inObject = `&object=${incidentObject}`;
        let searchString = `&search=${searchKey}`

        let search = `?${currentPage}${department}${reportStatus}${type}${inObject}${searchString}`;
        history.push({
            pathname: "/report/list-report",
            search,
        });
        fetchReport();
    }
    const handleChange = (e) => {

        let target = e.target;
        let { name, value } = target;

        setFilter({
            ...filter,
            [name]: value,
        })
        setParam()
    }
    const table = () => {
        const listTitle = ['#', 'Trạng thái', 'Mã BC', 'Loại BC', 'Đối tượng', 'Ngày báo cáo', 'Người báo cáo', 'Mô tả']
        let listRow = [];
        if (dataReport.length != 0 && dataCode.length != 0 && dataDepartment.length != 0) {
            listRow = dataReport.map((report, index) => {
                const reportType = dataCode.reportType.find((value) => value.code === report.reportType)
                const reportStatus = dataCode.reportStatus.find((value) => value.code === report.status);
                const incidentObject = dataCode.incidentObject.find((value) => value.code === report.incidentObject);

                const date = new Date(report.reportTime * 1000).getDate();
                const month = new Date(report.reportTime * 1000).getMonth();
                const year = new Date(report.reportTime * 1000).getFullYear();
                if (index + 1 > (page - 1) * sizePerPage && index + 1 <= page * sizePerPage)
                    return (
                        <tr>
                            <th scope="row">{(page - 1) * sizePerPage + index + 1}</th>
                            <td style={(reportStatus.code === "1") ? { color: 'rgb(254, 198, 0)' } : (reportStatus.code === "2") ? { color: 'rgb(39, 174, 96)' } : { color: 'rgb(36, 235, 199)' }}>{reportStatus?.name}</td>
                            <td>{report?.reportNo}</td>
                            <td>{reportType?.name}</td>
                            <td>{incidentObject?.name}</td>
                            <td>{date}/{month}/{year}</td>
                            <td>{report?.detector}</td>
                            <td>{report?.detailDescription}</td>
                        </tr>
                    )
            })
        }

        return (<table class="table">
            <thead>
                <tr>
                    {listTitle.map((value, index) => {
                        return <th scope="col">{value}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {listRow}
            </tbody>
        </table>)
    }
    const select = (type, name, value, select) => {
        let listOption = value.map((value, index) => {
            return (
                <option value={value}>{name[index]}</option>
            )
        })
        return (
            <select name={type} style={isMobile ? { width: '100%' } : { width: '15%' }} class="form-select" onChange={handleChange} value={select}>
                {listOption}
            </select>
        )
    }
    const pagination = () => {
        let list = [];
        for (let i = 1; i <= Math.floor(dataReport.length / sizePerPage); i++) {
            list.push(
                <li className={"page-item " + ((i === page) ? "active" : "")}>
                    <span className="page-link" href="#" onClick={() => { setPage(i) }}>
                        {i}
                    </span>
                </li>
            )
        }
        return (
            <nav aria-label="...">
                <ul className="pagination">
                    <li className="page-item">
                        <span className="page-link pe-auto" onClick={() => { setPage(page - 1) }}>‹</span>
                    </li>
                    {list}
                    <li className="page-item">
                        <span className="page-link pe-auto" onClick={() => { setPage(page + 1) }}>›</span>
                    </li>
                </ul>
            </nav>
        )
    }
    const listNav = ['Danh sách báo cáo', 'Theo dõi giải quyết sự cố', 'Số liệu thống kê', 'Quản lý phòng ban', 'Quản lý người dùng', 'Cấu hình hệ thống']
    return (
        <>
            <div className={load ? '' : 'd-none'} style={styles.load}>Loading</div>
            <div style={styles.nav}>
                <img src={ICON1} style={styles.icon} />
                <MobileView>
                    <button type="button" className="btn btn-link" onClick={() => { setCollapse(!collapse) }}>Open</button>
                </MobileView>
                <BrowserView style={styles.listLink}>
                    {listNav.map((value, index) => {
                        return <p className='m-0 fw-bold'>{value}</p>
                    })}
                </BrowserView>
                <span style={{ position: 'relative' }}>
                    <img src={ICON2} style={styles.icon} onClick={() => { setInfo(!info) }} />
                    <span className={info ? '' : 'd-none'} style={{
                        width: 'max-content',
                        border: ' 1px solid #ccc',
                        boxShadow: '0 2px 10px rgb(0 0 0 / 20%)',
                        borderRadius: '5px',
                        position: 'absolute',
                        right: 0,
                        background: '#fff',
                        padding: '1rem',
                        top: '100%'
                    }}>
                        <p>Tôi là Quản lý sự cố</p>
                        <p>nakien.it@gmail.com</p>
                        <button type="button" class="btn btn-primary mt-2 w-100">Log out</button>
                    </span>
                </span>

            </div>
            <MobileView>
                <div style={styles.collapse} className={(collapse ? '' : 'd-none ') + 'd-flex flex-column align-items-center'}>
                    {listNav.map((value, index) => {
                        return <p className='m-0 fw-bold d-block'>{value}</p>
                    })}
                </div>
            </MobileView>
            <div className='container-fluid' style={styles.container}>
                <div className='row'>
                    <div className='col-lg-10 offset-lg-1 col-sm-12'>
                        <div className='container-fluid'>
                            <div className='row' style={styles.panel}>
                                <h4 className='col-lg-6 col-sm-12'>Danh sách báo cáo</h4>
                                <div className='col-lg-6 col-sm-12'>
                                    <div className='row'>
                                        <button type="button" className="btn btn-danger col-lg-7 col-sm-12">Báo cáo sự cố</button>
                                        <button type="button" className="btn btn-danger col-lg-4 offset-lg-1 col-sm-12">Báo cáo sự cố</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={styles.card}>
                            <div className='container-fluid'>
                                <BrowserView viewClassName='d-flex justify-content-between row'>
                                    <input onChange={handleChange} name='searchKey' className="form-control col-sm-12" style={{ width: '30%' }} placeholder="Tìm tên người báo cáo, số bệnh án" />
                                    {dataDepartment ? select('departmentId', ['-Phòng ban-', ...Array.from(dataDepartment, ({ departmentName }) => departmentName)], [null, ...Array.from(dataDepartment, ({ id }) => id)], filter.departmentId) : ''}
                                    {dataCode.reportStatus ? select('status', ['-Trạng thái-', ...Array.from(dataCode.reportStatus, ({ name }) => name)], [null, ...Array.from(dataCode.reportStatus, ({ code }) => code)], filter.status) : ''}
                                    {dataCode.reportType ? select('reportType', ['-Loại báo cáo-', ...Array.from(dataCode.reportType, ({ name }) => name)], [null, ...Array.from(dataCode.reportType, ({ code }) => code)], filter.reportType) : ''}
                                    {dataCode.incidentObject ? select('incidentObject', ['-Đối tượng-', ...Array.from(dataCode.incidentObject, ({ name }) => name)], [null, ...Array.from(dataCode.incidentObject, ({ code }) => code)], filter.incidentObject) : ''}
                                    <select style={{ width: '25%' }} class="form-select mt-4" onChange={(e) => setSizePerPage(e.target.value)}>
                                        <option value='5'>Hiển thị 5 mẩu tin/trang</option>
                                        <option value='10'>Hiển thị 10 mẩu tin/trang</option>
                                        <option value='15'>Hiển thị 15 mẩu tin/trang</option>
                                    </select>
                                </BrowserView>
                                <MobileView viewClassName='row'>
                                    <input onChange={handleChange} name='searchKey' className="form-control col-sm-12" style={{ width: '100%' }} placeholder="Tìm tên người báo cáo, số bệnh án" />
                                    {dataDepartment ? select('departmentId', ['-Phòng ban-', ...Array.from(dataDepartment, ({ departmentName }) => departmentName)], [null, ...Array.from(dataDepartment, ({ id }) => id)]) : ''}
                                    {dataCode.reportStatus ? select('status', ['-Trạng thái-', ...Array.from(dataCode.reportStatus, ({ name }) => name)], [null, ...Array.from(dataCode.reportStatus, ({ id }) => id)]) : ''}
                                    {dataCode.reportType ? select('reportType', ['-Loại báo cáo-', ...Array.from(dataCode.reportType, ({ name }) => name)], [null, ...Array.from(dataCode.reportType, ({ id }) => id)]) : ''}
                                    {dataCode.incidentObject ? select('incidentObject', ['-Đối tượng-', ...Array.from(dataCode.incidentObject, ({ name }) => name)], [null, ...Array.from(dataCode.incidentObject, ({ id }) => id)]) : ''}

                                    <select style={{ width: '100%' }} class="form-select mt-4" onChange={(e) => setSizePerPage(e.target.value)}>
                                        <option value='5'>Hiển thị 5 mẩu tin/trang</option>
                                        <option value='10'>Hiển thị 10 mẩu tin/trang</option>
                                        <option value='15'>Hiển thị 15 mẩu tin/trang</option>
                                    </select>
                                </MobileView>
                                <div className='row mt-3 overflow-auto'>
                                    {table()}
                                </div>
                                <div className='row mt-3 d-flex justify-content-between'>
                                    <h6 className='col-lg-10 col-sm-12'>Hiển thị {(page - 1) * sizePerPage + 1} - {page * sizePerPage} trên tổng {dataReport.length} báo cáo</h6>
                                    <div className='d-flex col-lg-2 col-sm-12 justify-content-center'>
                                        {pagination()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const styles = {
    load: {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        right: 0,
        opacity: 0.5,
        background: 'white',
        zIndex: 9999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nav: {
        backgroundColor: 'white',
        height: '20%',
        maxHeight: '200px',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    listLink: {
        width: '80%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    icon: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        cursor: 'pointer',
    },
    collapse: {
        width: '100vw',
        display: 'flex',
    },
    container: {
        backgroundImage: `linear-gradient(#a0d2e6 20%, #f0f8ff 20%)`,
        minHeight: '100vh',
    },
    title: {
        textAlign: 'center',
        color: 'white',
        padding: '5% 0 5% 0'
    },
    panel: {
        padding: '4% 0 4% 0',
    },
    card: {
        borderRadius: '4px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgb(0 0 0 / 5%)',
        padding: '1.5rem',
        background: '#fff'
    },
    button: {
        width: '70%',
        margin: '0 auto 0 auto',
        display: 'block'
    },
}