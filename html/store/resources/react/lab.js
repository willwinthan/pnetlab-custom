require('./bootstrap');

import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom'
import Loading from './components/common/Loading'
import ContextMenu from './components/common/ContextMenu'
import * as qs from 'query-string';

import '../assets/css/app.scss';
import './components/lab/type.scss';
import './components/input/responsive/input.scss';

import Timer from './components/lab/timer/Timer';
import Topo from './components/lab/topo/Topo';
import Wb_bar from './components/lab/workbook/viewer/Wb_bar';
import HTMLConsole from './components/lab/html/HTMLConsole';
import Wireshark from './components/lab/wireshark/Wireshark';
import TextControl from './components/lab/text/TextControl';
import LinkControl from './components/lab/link/LinkControl';
import LinkQuality from './components/lab/link/LinkQuality';
import LineControl from './components/lab/line/LineControl';
import LockLabModal from './components/lab/locklab/LockLabModal';
import LabBackground from './components/lab/background/LabBackground';
import NodeSize from './components/lab/node/NodeSize';
import StatusModal from './components/lab/status/StatusModal';
import NodeFolderModal from './components/lab/commit/NodeFolderModal';
import NodeCommitModal from './components/lab/commit/NodeCommitModal';
import IconEditor from './components/lab/image/IconEditor';

require('./components/lab/multiconfig/MultiCfgInit');
import topology from './components/lab/topology/topology';
import NodeForm from './components/lab/node/NodeForm';
import UnifiedSidebar from './components/menu/UnifiedSidebar';

global.App = {};
App.server = server;
App.pages = {};
App.parsed = {};

App.loading = (flag, text) => {
  App.Loading.loading(flag, text);
  return '';
}

App.getInitialProps = (search) => {
  var parsed = qs.parse(search);
  App.parsed = parsed;
}

App.isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

App.onReadyRegister = [];
App.topology = new topology();
var dataProcess = App.topology.getTopoData()

function LabLayout() {
  const labPath = window.lab ? window.lab.filename : (window.LAB || "");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* 1. Left Sidebar Navigation */}
      <UnifiedSidebar />

      {/* 2. Main Lab Viewport Area */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* jsPlumb Interactive Topology Canvas */}
        <div 
          id="lab-viewport" 
          data-path={labPath}
          className="flex-1 overflow-auto relative bg-[#09152b] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent select-none"
        >
          {/* Nodes and SVG connections are appended here by topology.js */}
        </div>

        {/* 3. Floating Overlay Controls */}
        <div className="absolute top-4 right-4 z-30">
          <Topo />
        </div>

        <div className="absolute top-4 left-4 z-30 pointer-events-none">
          <div className="pointer-events-auto">
            <Timer />
          </div>
        </div>

        {/* 4. Bottom Capture/Terminal Pill Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-none">
          <div className="pointer-events-auto flex gap-3">
            <Wireshark />
            <HTMLConsole />
          </div>
        </div>
      </div>

      {/* Legacy Portals & Dialog Modals */}
      <Wb_bar />
      <TextControl />
      <NodeSize />
      <LinkControl />
      <LineControl ref={c => App.lineControl = c} />
      <LinkQuality />
      <LockLabModal />
      <LabBackground />
      <StatusModal />
      <NodeFolderModal />
      <NodeCommitModal />
      <NodeForm />
      
      {/* Global Utilities */}
      <Loading ref={(loading) => { App.Loading = loading }} flag={false} text="Loading..." />
      <ContextMenu />
      <IconEditor />

      {/* Notifications system container */}
      <div>
        <div id="alert_container" style={{ display: 'none' }}>
          <b>
            <i className="fa fa-bell-o"></i> Notifications&nbsp;
            <i id="alert_container_close" className="pull-right fa fa-times" style={{ color: 'red', cursor: 'pointer', padding: 2 }}></i>
          </b>
          <div className="inner" style={{ overflow: 'auto', maxHeight: 400 }}></div>
        </div>
        <div id="notification_container" />
      </div>
    </div>
  );
}

// Mount the app to #react-lab-root and register initialization hooks
const mountPoint = document.getElementById('react-lab-root');
if (mountPoint) {
  render(
    <LabLayout />, 
    mountPoint, 
    () => {
      dataProcess.then(() => {
        App.topology.printTopology()
        App.onReadyRegister.map(func => {
          if (typeof func === 'function') func();
        })
      })
    }
  );
}
