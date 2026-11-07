/** The self-playing agent conversation. Pure CSS on one shared 20 s clock (see site.css, p2-hero). */
export function HeroDesk() {
  return (
    <div className="hd-desk" aria-label="One order on the Order-to-Cash agent desk: a staff message, a proposed plan, a confirm, a post to SAP">
      <div className="hd-h">
        <b>Order-to-Cash agent</b>
        <span className="hd-st" aria-hidden="true">
          <i className="s1">Reading</i>
          <i className="s2">Proposed</i>
          <i className="s3">Waiting for you</i>
          <i className="s4">Posted</i>
        </span>
      </div>
      <div className="hd-t">
        <div className="hd-m hd-me hd-k1">
          <div className="hd-b">Book this, usual terms.</div>
          <div className="hd-meta">
            <span className="hd-att">PO photo &middot; 3 pages</span>
            <time>09:15</time>
          </div>
          <i className="hd-av hd-person" />
        </div>
        <div className="hd-m hd-ag">
          <i className="hd-av hd-agent" />
          <div className="hd-typ hd-k2" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="hd-b hd-k3">
            <b>22 lines in 28 s</b>
            <span className="hd-fld">grade &middot; width &middot; quantity &middot; rate</span>
          </div>
          <div className="hd-card hd-k4">
            <div className="hd-ct">Proposed plan</div>
            <ol>
              <li>
                <i className="k-agent">1</i>Fill draft from PO
              </li>
              <li>
                <i className="k-ret">2</i>Buyer&rsquo;s usual terms; price from today&rsquo;s list
              </li>
              <li>
                <i className="k-erp">3</i>Create sales order in SAP
              </li>
            </ol>
            <div className="hd-cf">
              <span className="hd-ok">Confirm</span>
              <span className="hd-ed">Edit</span>
            </div>
          </div>
        </div>
        <div className="hd-m hd-me hd-yes hd-k5">
          <div className="hd-b">yes</div>
          <i className="hd-av hd-person" />
        </div>
        <div className="hd-m hd-ag hd-done">
          <i className="hd-av hd-agent" />
          <div className="hd-typ hd-k6" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="hd-res hd-k7">
            <i className="hd-chk" aria-hidden="true" />
            Sales order saved in SAP<time>09:16</time>
          </div>
        </div>
      </div>
    </div>
  )
}
