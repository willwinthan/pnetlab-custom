import React, { Component } from 'react'
import WiresharkModal from './WiresharkModal';
import { Eye, X, Activity } from 'lucide-react'

class Wireshark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wiresharks: [],
            isOpen: false
        }
        this.wiresharkModals = {};
    }

    render() {
        if (this.state.wiresharks.length === 0) return null;

        return (
            <div className="relative flex items-center justify-center font-sans">
                {/* Floating Wireshark Pill */}
                <button
                    onClick={() => this.setState(prev => ({ isOpen: !prev.isOpen }))}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900/95 border border-slate-800/80 backdrop-blur-md text-slate-200 hover:text-white rounded-full shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 font-medium text-sm group"
                >
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                    </span>
                    <Activity className="h-4 w-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                    <span>Wireshark ({this.state.wiresharks.length})</span>
                </button>

                {/* Dropup Panel */}
                {this.state.isOpen && (
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-72 max-h-60 overflow-y-auto bg-slate-950/95 border border-slate-800/85 backdrop-blur-md rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/50 mb-1">
                            Active Captures
                        </div>
                        {this.state.wiresharks.map(item => (
                            <div 
                                key={item.ws_id} 
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900/80 border border-transparent hover:border-slate-800/30 transition-all cursor-pointer group"
                                onClick={() => {
                                    this.wiresharkModals[item.ws_id].capture();
                                    this.wiresharkModals[item.ws_id].modal();
                                    this.wiresharkModals[item.ws_id].closeNewTab();
                                    this.wiresharkModals[item.ws_id].setPostion('15%', '150px');
                                    this.setState({ isOpen: false });
                                }}
                            >
                                <div className="flex items-center gap-2 text-slate-300 group-hover:text-cyan-300 transition-colors">
                                    <Eye className="h-3.5 w-3.5 text-cyan-400" />
                                    <span 
                                        className="text-xs font-medium truncate max-w-[160px]" 
                                        title={`${item.ws_node_name} ${item.ws_if_name}`}
                                    >
                                        {item.ws_node_name} - {item.ws_if_name}
                                    </span>
                                </div>
                                <button
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        this.wiresharkModals[item.ws_id].deleteWireshark();
                                    }}
                                    className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                                    title="Stop capture"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modals Container */}
                {this.state.wiresharks.map(item => (
                    <WiresharkModal 
                        key={item.ws_id} 
                        wireshark={item} 
                        ref={modal => this.wiresharkModals[item.ws_id] = modal}
                        onDel={() => { this.loadWiresharks() }}
                    />
                ))}
            </div>
        )
    }

    componentDidMount() {
        global.wireshark_capture = (node_id, if_id) => {
            this.addWireshark(node_id, if_id);
        }
        this.loadWiresharks();
    }

    showWireshark(node_id, interface_id) {
        const wireshark = this.state.wiresharks.find(
            item => (item['ws_node'] == node_id && item['ws_if'] == interface_id)
        );

        if (wireshark) {
            if (this.wiresharkModals[wireshark.ws_id]) {
                this.wiresharkModals[wireshark.ws_id].capture();
                this.wiresharkModals[wireshark.ws_id].modal();
                return true;
            }
        }
        return false;
    }

    addWireshark(node_id, interface_id) {
        if (this.showWireshark(node_id, interface_id)) return;

        return axios.request({
            url: `/api/labs/session/wireshark/add`,
            method: 'post',
            data: { node_id, interface_id }
        })
        .then(response => {
            const resData = response['data'];
            if (resData['status'] === 'success') {
                this.loadWiresharks(node_id, interface_id);
            } else {
                error_handle(resData);
            }
        })
        .catch(function (error) {
            console.log(error);
            error_handle(error);
        })
    }

    loadWiresharks(node_id = null, interface_id = null) {
        return axios.request({
            url: `/api/labs/session/wireshark`,
            method: 'get',
            data: {}
        })
        .then(response => {
            const resData = response['data'];
            if (resData['status'] === 'success') {
                this.setState({
                    wiresharks: resData['message']
                }, () => {
                    if (node_id != null && interface_id != null) {
                        this.showWireshark(node_id, interface_id);
                    }
                })
            } else {
                error_handle(resData);
            }
        })
        .catch(function (error) {
            console.log(error);
            error_handle(error);
        })
    }
}

export default Wireshark;