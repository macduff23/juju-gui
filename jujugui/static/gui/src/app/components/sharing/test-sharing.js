/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2017 Canonical Ltd.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3, as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

var juju = {components: {}}; // eslint-disable-line no-unused-vars

chai.config.includeStack = true;
chai.config.truncateThreshold = 0;

describe('Sharing', () => {

  beforeAll((done) => {
    // By loading this file it adds the component to the juju components.
    YUI().use('sharing', () => { done(); });
  });

  it('can render with no users', () => {
    const getModelUserInfo = sinon.stub().returns([]);
    const renderer = jsTestUtils.shallowRender(
      <juju.components.Sharing
        getModelUserInfo={getModelUserInfo} />, true);
    const output = renderer.getRenderOutput();
    const expectedButtons = [{
      title: 'Done',
      action: undefined,
      type: 'positive'
    }];
    const expected = (
      <juju.components.Popup
        className="sharing__popup"
        title="Share"
        buttons={expectedButtons}>
        <div className="sharing__users">
          <h5 className="sharing__users-header">Users with access</h5>
          {undefined}
        </div>
      </juju.components.Popup>
    );
    assert.deepEqual(output, expected);
  });

  it('can render with users', () => {
    const getModelUserInfo = sinon.stub().callsArgWith(0, false, [
      {
        name: 'drwho',
        displayName: 'Dr. Who',
        lastConnection: 'now',
        access: 'admin'
      }, {
        name: 'dalek',
        displayName: 'Dalek',
        lastConnection: 'never',
        access: 'write',
        err: 'exterminate!'
      }
    ]);
    const renderer = jsTestUtils.shallowRender(
      <juju.components.Sharing
        getModelUserInfo={getModelUserInfo} />, true);
    const output = renderer.getRenderOutput();
    // Get all the children except the header, which is the first item in the
    // array.
    const actual = output.props.children.props.children[1];
    const expected = [(
      <div key="drwho" className="sharing__user">
        <div className="sharing__user-name">
          drwho
        </div>
        <div className="sharing__user-displayname">
          Dr. Who
        </div>
        <div className="sharing__user-access">
          admin
        </div>
      </div>
    ), (
      <div key="dalek" className="sharing__user">
        <div className="sharing__user-name">
          dalek
        </div>
        <div className="sharing__user-displayname">
          Dalek
        </div>
        {undefined}
      </div>
    )];
    assert.deepEqual(actual, expected);
  });
});