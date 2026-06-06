import React, { Component } from 'react'
import HTMLConsoleModal from './HTMLConsoleModal';
import { render } from 'react-dom';
import ConsoleSwitch from './ConsoleSwitch';
import { Monitor } from 'lucide-react'

class HTMLConsole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            console: 0
        }
    }

    render() {
        if (this.state.console <= 0) return null;

        return (
            <div className="relative flex items-center justify-center font-sans">
                <button
                    onClick={() => {
                        if (this.consoleModal.isHide) {
                            this.consoleModal.modal();
                            this.consoleModal.setPostion('25%', '250px');
                            this.consoleModal.closeNewTag();
                        } else {
                            this.consoleModal.modal('hide');
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900/95 border border-slate-800/80 backdrop-blur-md text-slate-200 hover:text-white rounded-full shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 font-medium text-sm group"
                >
                    <Monitor className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Terminal ({this.state.console})</span>
                </button>

                <HTMLConsoleModal
                    ref={modal => this.consoleModal = modal}
                    onAddTab={() => this.setState({ console: Number(this.state.console) + 1 })}
                    onDelTab={() => {
                        var number = Number(this.state.console) - 1 ;
                        if (number <= 0) {
                            this.consoleModal.modal('hide');
                            number = 0;
                        }
                        this.setState({ console: number })
                    }}
                />
            </div>
        )
    }

    addTab(nid, flag = '_self') {
        if (window.nodes[nid]) {
            var node = window.nodes[nid];
            if (node['status'] == 2 || node['status'] == 3) {
                var url = node['url'];
                if (url.includes('guacamole')) {
                    this.consoleModal.addTab(node['name'], nid, 1);
                } else {
                    if (node['console'] == 'http' || node['console'] == 'https') flag = '_blank';
                    window.open(url, flag);
                }
            }
        }
    }

    addTab2nd(nid, flag = '_self') {
        if (window.nodes[nid]) {
            var node = window.nodes[nid];
            if (node['status'] == 2 || node['status'] == 3) {
                var url = node['url_2nd'];
                if (url.includes('guacamole')) {
                    this.consoleModal.addTab(node['name'], nid, 2);
                } else {
                    if (node['console_2nd'] == 'http' || node['console_2nd'] == 'https') flag = '_blank';
                    window.open(url, flag);
                }
            }
        }
    }

    componentDidMount() {
        global.nodehtmlconsoledown = (e, flag = '_self') => {
            console.log('mousedown');
            this.flag = flag;
            App.topology.isClick = true;
            if (this.isClickTimeout) clearTimeout(this.isClickTimeout);
            this.isClickTimeout = setTimeout(() => { App.topology.isClick = false }, 200)
        };

        $(document).on('click', '.nodehtmlconsole', (e) => {
            if (e.metaKey || e.ctrlKey) {
                console.log('Selecting');
                return;
            }
            if (App.topology.isClick) {
                var nid = e.currentTarget.getAttribute('nid')
                this.addTab(nid, this.flag);
            }
        });

        $(document).on('click', '.nodehtmlconsole2nd', (e) => {
            if (App.topology.isClick) {
                var nid = e.currentTarget.getAttribute('nid')
                this.addTab2nd(nid);
            }
        });

        const changeConsoleEl = document.getElementById('action_change_console');
        if (changeConsoleEl) {
            render(<ConsoleSwitch />, changeConsoleEl);
        }
    }
}

export default HTMLConsole;