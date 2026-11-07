'use client'

import { Fragment, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { SectionHeading } from './Heading'
import { WORKFLOWS, type Workflow } from '@/content/workflows'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

function Panel({ workflow, open }: { workflow: Workflow; open: boolean }) {
  const reduce = useReducedMotion()
  // stays in the document when closed so the words are always there; `hidden` removes it from the grid
  // only after the closing animation has finished
  const [visible, setVisible] = useState(open)
  if (open && !visible) setVisible(true)

  return (
    <motion.div
      className="more-shell"
      hidden={!open && !visible}
      initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={reduce ? { duration: 0 } : { height: { duration: 0.26, ease: EASE_OUT }, opacity: { duration: 0.18 } }}
      onAnimationComplete={() => {
        if (!open) setVisible(false)
      }}
    >
      <div className="more wf-more" id={workflow.id}>
        {workflow.panels.map((panel, i) => (
          <motion.div
            key={panel.kind}
            className={`wf-p ${panel.kind}`}
            initial={false}
            animate={open ? { opacity: 1, transform: 'translateY(0px)' } : { opacity: 0, transform: 'translateY(8px)' }}
            transition={reduce ? { duration: 0 } : { duration: 0.28, ease: EASE_OUT, delay: open ? 0.05 + i * 0.045 : 0 }}
          >
            <span className="k">{panel.label}</span>
            <p>{panel.body}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function Workflows() {
  const [openId, setOpenId] = useState<string | null>(null)
  const cards = useRef(new Map<string, HTMLButtonElement>())

  const toggle = (id: string) => {
    const opening = openId !== id
    setOpenId(opening ? id : null)
    if (opening) {
      requestAnimationFrame(() => cards.current.get(id)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
    }
  }

  return (
    <section className="sec fs" id="workflows">
      <div className="wrap">
        <SectionHeading
          legendClass="wf-legend"
          legend={
            <>
              <span>
                <i />
                Outside world
              </span>
              <span>
                <i className="agent" />
                Agents
              </span>
              <span>
                <i className="person" />A person signs
              </span>
              <span>
                <i className="erp" />
                Posted to the ERP
              </span>
            </>
          }
        >
          Six workflows every plant runs
        </SectionHeading>
        <div className="wgrid wf-grid">
          {WORKFLOWS.map((workflow) => (
            <Fragment key={workflow.id}>
              <button
                ref={(el) => {
                  if (el) cards.current.set(workflow.id, el)
                  else cards.current.delete(workflow.id)
                }}
                className="wc wf-card"
                type="button"
                data-rv=""
                aria-expanded={openId === workflow.id}
                aria-controls={workflow.id}
                onClick={() => toggle(workflow.id)}
              >
                <span className="code">{workflow.code}</span>
                <span className="h3">{workflow.title}</span>
                <span className="one">{workflow.one}</span>
                <span className="subs">
                  {workflow.subs.map((sub) => (
                    <span key={sub}>{sub}</span>
                  ))}
                </span>
              </button>
              <Panel workflow={workflow} open={openId === workflow.id} />
            </Fragment>
          ))}
        </div>
        <div className="wclose" data-rv="">
          <b>Six of hundreds.</b>
          <span>A plant runs hundreds of workflows like these. We take them one desk at a time, each measured before the next, on the same OS and under the same sign-off.</span>
        </div>
      </div>
    </section>
  )
}
