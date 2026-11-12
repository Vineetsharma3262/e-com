import Link from "next/link";
import { site } from "@/lib/site";

export const metadata = {
  title: "Terms & Conditions",
};

const prose =
  "space-y-3 leading-relaxed text-muted [&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_b]:font-semibold [&_b]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5";

const toc = [
  ["cookies", "Cookies"],
  ["license", "License"],
  ["hyperlinking", "Hyperlinking to our content"],
  ["iframes", "iFrames"],
  ["content-liability", "Content liability"],
  ["reservation", "Reservation of rights"],
  ["removal", "Removal of links from our website"],
  ["grievance", "Grievance officer"],
  ["disclaimer", "Disclaimer"],
  ["jurisdiction", "Jurisdiction"],
];

function Block({ id, title, children }) {
  return (
    <section id={id} className="mt-10 scroll-mt-36">
      <h2 className="font-serif text-2xl font-semibold">{title}</h2>
      <div className={`mt-3 ${prose}`}>{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 lg:px-8">
      <article className="mx-auto max-w-3xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-accent">{site.name}</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">Terms & Conditions</h1>
        <p className="mt-3 text-sm text-muted">Last updated: 12 November 2026</p>
        <div className={`mt-6 text-[17px] ${prose}`}>
          <p>Welcome to {site.name}.</p>
          <p>
            These terms and conditions outline the rules and regulations for the use of the {site.name} website.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use {site.name} if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: “Client”, “You” and “Your” refers to you, the person who logs on to this website and complies with the Company’s terms and conditions. “The Company”, “Ourselves”, “We”, “Our” and “Us”, refers to our Company. “Party”, “Parties”, or “Us”, refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to the prevailing law of India. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to the same.
          </p>
        </div>
        <nav aria-label="Contents" className="mt-8 rounded-2xl border border-line bg-card p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-muted">Contents</p>
          <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
            {toc.map(([id, label]) => (
              <li key={id}>
                <a className="hover:text-accent" href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ol>
        </nav>

        <Block id="cookies" title="Cookies">
          <p>
            We employ the use of cookies. By accessing {site.name}, you agreed to use cookies in agreement with the {site.name} <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <p>
            Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate or advertising partners may also use cookies.
          </p>
        </Block>

        <Block id="license" title="License">
          <p>
            Unless otherwise stated, {site.name} and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access this from {site.name} for your own personal use, subject to the restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from {site.name}</li>
            <li>Sell, rent or sub-license material from {site.name}</li>
            <li>Reproduce, duplicate or copy material from {site.name}</li>
            <li>Redistribute content from {site.name}</li>
          </ul>
          <p>
            Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. {site.name} does not filter, edit, publish or review comments prior to their presence on the website. Comments do not reflect the views and opinions of {site.name}, its agents and/or affiliates. Comments reflect the views and opinions of the person who posts them. To the extent permitted by applicable laws, {site.name} shall not be liable for the comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the comments on this website.
          </p>
          <p>
            {site.name} reserves the right to monitor all comments and to remove any comments which can be considered inappropriate, offensive or which cause a breach of these Terms and Conditions.
          </p>
          <p>You warrant and represent that:</p>
          <ul>
            <li>You are entitled to post the comments on our website and have all necessary licenses and consents to do so;</li>
            <li>The comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
            <li>The comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy;</li>
            <li>The comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
          </ul>
          <p>
            You hereby grant {site.name} a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your comments in any and all forms, formats or media.
          </p>
        </Block>

        <Block id="hyperlinking" title="Hyperlinking to our content">
          <p>The following organizations may link to our website without prior written approval:</p>
          <ul>
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our website in the same manner as they hyperlink to the websites of other listed businesses; and</li>
            <li>System-wide accredited businesses, except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups, which may not hyperlink to our website.</li>
          </ul>
          <p>
            These organizations may link to our home page, to publications or to other website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party’s site.
          </p>
          <p>We may consider and approve other link requests from the following types of organizations:</p>
          <ul>
            <li>commonly known consumer and/or business information sources;</li>
            <li>dot.com community sites;</li>
            <li>associations or other groups representing charities;</li>
            <li>online directory distributors;</li>
            <li>internet portals;</li>
            <li>accounting, law and consulting firms; and</li>
            <li>educational institutions and trade associations.</li>
          </ul>
          <p>
            We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates for the absence of {site.name}; and (d) the link is in the context of general resource information.
          </p>
          <p>
            These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party’s site.
          </p>
          <p>
            If you are one of the organizations listed above and are interested in linking to our website, you must inform us by sending an email to <a href={`mailto:${site.email}`}>{site.email}</a>. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our website, and a list of the URLs on our site to which you would like to link. Wait 2–3 weeks for a response.
          </p>
          <p>Approved organizations may hyperlink to our website as follows:</p>
          <ul>
            <li>By use of our corporate name; or</li>
            <li>By use of the uniform resource locator being linked to; or</li>
            <li>By use of any other description of our website being linked to that makes sense within the context and format of content on the linking party’s site.</li>
          </ul>
          <p>No use of the {site.name} logo or other artwork will be allowed for linking without a trademark license agreement.</p>
        </Block>

        <Block id="iframes" title="iFrames">
          <p>
            Without prior approval and written permission, you may not create frames around our web pages that alter in any way the visual presentation or appearance of our website.
          </p>
        </Block>

        <Block id="content-liability" title="Content liability">
          <p>
            We shall not be held responsible for any content that appears on your website. You agree to protect and defend us against all claims that arise on your website. No link(s) should appear on any website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
          </p>
        </Block>

        <Block id="reservation" title="Reservation of rights">
          <p>
            We reserve the right to request that you remove all links or any particular link to our website. You agree to immediately remove all links to our website upon request. We also reserve the right to amend these terms and conditions and the linking policy at any time. By continuously linking to our website, you agree to be bound by and follow these linking terms and conditions.
          </p>
        </Block>

        <Block id="removal" title="Removal of links from our website">
          <p>
            If you find any link on our website that is offensive for any reason, you are free to contact and inform us at any moment. We will consider requests to remove links, but we are not obligated to do so or to respond to you directly.
          </p>
          <p>
            We do not ensure that the information on this website is correct. We do not warrant its completeness or accuracy, nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
          </p>
        </Block>

        <Block id="grievance" title="Grievance officer">
          <p>
            In accordance with applicable laws and regulations, the Company has appointed a Grievance Officer to address any complaints, concerns, or grievances regarding the use of this website and its services.
          </p>
          <address className="rounded-2xl border border-line bg-card p-5 not-italic">
            <b>Grievance Officer</b>, Customer Care, {site.name}
            <br />
            Email: <a href={`mailto:${site.email}`}>{site.email}</a>
            <br />
            Phone/WhatsApp: <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
          </address>
          <p>
            Users may contact the Grievance Officer for issues related to data privacy, service-related complaints, or any violation of these Terms and Conditions. The Company shall acknowledge and resolve the grievance within a reasonable timeframe as prescribed under applicable law.
          </p>
        </Block>

        <Block id="disclaimer" title="Disclaimer">
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul>
            <li>limit or exclude our or your liability for death or personal injury;</li>
            <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
          <p>
            The limitations and prohibitions of liability set in this section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
          </p>
          <p>
            As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
          </p>
        </Block>

        <Block id="jurisdiction" title="Jurisdiction">
          <p>Any dispute arising under these terms and conditions shall be subject to the jurisdiction of the courts in India only.</p>
          <address className="rounded-2xl border border-line bg-card p-5 not-italic">
            <b>{site.name}</b>
            <br />
            {site.addressOneLine}
            <br />
            Phone: <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
            <br />
            Email: <a href={`mailto:${site.email}`}>{site.email}</a>
          </address>
        </Block>

        <p className="mt-12 border-t border-line pt-6 text-sm text-muted [&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2">
          See also: <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms & Conditions</Link>
        </p>
      </article>
    </div>
  );
}
