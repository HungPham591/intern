import { useState } from "react"
import axios from 'axios';
import { useHistory } from "react-router-dom";

export default function Login(props) {
    let history = useHistory();
    const [alert, showAlert] = useState(false);
    const [data, setData] = useState({})
    const [modal, showModal] = useState(false);

    const checkLogin = async () => {
        if (!data.username || !data.password) {
            showAlert(true);
            return
        }
        const URL = "https://qlsc.maysoft.io/server/api/auth/login"
        const DATA = data;
        const HEADER = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        }
        const result = await axios.post(URL, DATA, { headers: HEADER })
        console.log(result)
        if (result.data.code === 200) {
            sessionStorage.setItem('TOKEN', JSON.stringify(result.data.data));
            history.push('/')
        } else {
            showModal(true)
        }
    }
    const handleInputChange = (e) => {
        let target = e.target;
        let { name, value } = target;

        setData({
            ...data,
            [name]: value,
        })
    }
    const modalContainer = () => {
        if (modal)
            return (
                <div style={styles.modal} className="modal" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thông báo</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <p>Bạn nhập sai tài khoản hoặc mật khẩu</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { showModal(false) }}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
    }
    return (
        <>
            {modalContainer()}
            <div className='container-fluid' style={styles.container}>
                <div className='row'>
                    <div className='col-lg-6 offset-3'>
                        <h3 style={styles.title}>Đăng nhập</h3>
                        <div style={styles.card}>
                            <div className="form-group">
                                <label className="py-2" htmlFor="exampleInputEmail1">Tên tài khoản</label>
                                <input name='username' onChange={handleInputChange} className="form-control" placeholder="Enter account" />
                                <p className={'text-danger ' + (!alert ? 'd-none' : '')}>Trường dữ liệu là bắt buộc</p>
                            </div>
                            <div className="form-group mt-3">
                                <label className="py-2" htmlFor="exampleInputEmail1">Mật khẩu</label>
                                <input name='password' onChange={handleInputChange} className="form-control" placeholder="Enter password" />
                                <p className={'text-danger ' + (!alert ? 'd-none' : '')}>Trường dữ liệu là bắt buộc</p>
                            </div>
                            <button style={styles.button} type="button" class="btn btn-primary mt-3" onClick={checkLogin}>Đăng nhập</button>
                        </div>
                        <div className='mt-3' style={styles.blueCard}>
                            <p style={styles.smallTitle}>Chưa có tài khoản?</p>
                            <button style={styles.button} type="button" class="btn btn-primary">Đăng ký sử dụng</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const styles = {
    title: {
        textAlign: 'center',
        color: 'white',
        padding: '5% 0 5% 0'
    },
    smallTitle: {
        textAlign: 'center', color: 'white'
    },
    card: {
        borderRadius: '4px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgb(0 0 0 / 5%)',
        padding: '1.5rem',
        background: '#fff'
    },
    container: {
        width: '100vw',
        height: '100vh',
        backgroundImage: `linear-gradient(#a0d2e6 20%, #f0f8ff 20%)`,
    },
    button: {
        width: '70%',
        margin: '0 auto 0 auto',
        display: 'block'
    },
    blueCard: {
        borderRadius: '4px',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 8px rgb(0 0 0 / 5%)',
        padding: '1.5rem',
        background: '#CAEBF2'
    }, modal: {
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: "block",
        margin: 'auto'
    }
}
//src(http://joombig.com/v/tem/images/tech_1/image959350.jpg)