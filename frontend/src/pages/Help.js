import React, { useState } from 'react';
import {
    MdDashboard, MdPeople, MdSchool, MdAttachMoney, MdInventory, MdNotifications,
    MdHelp, MdExpandMore, MdExpandLess, MdPhone, MdEmail, MdAccessTime
} from 'react-icons/md';
import TopBar from '../components/TopBar';

const Help = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const features = [
        {
            icon: <MdDashboard size={28} color="#2F80ED" />,
            title: "Dashboard Overview",
            description: "Get a bird's-eye view of your entire school system. Track key metrics like total students, teachers, schools, and financial growth at a glance.",
            bg: "#EBF2FF"
        },
        {
            icon: <MdSchool size={28} color="#27AE60" />,
            title: "School Management",
            description: "Add, edit, and manage multiple schools. Monitor their status (Active/Inactive), view admin assignments, and track performance metrics.",
            bg: "#EBF9F1"
        },
        {
            icon: <MdPeople size={28} color="#F2994A" />,
            title: "User Management",
            description: "Manage Admins, Teachers, and Students efficiently. Assign roles, update profiles, and track attendance and performance.",
            bg: "#FFF8E1"
        },
        {
            icon: <MdAttachMoney size={28} color="#EB5757" />,
            title: "Fee Status",
            description: "Monitor fee collections in real-time. View paid, pending, and unpaid statuses. Visual charts help you analyze financial health.",
            bg: "#FFEAEA"
        },
        {
            icon: <MdInventory size={28} color="#9B51E0" />,
            title: "Inventory",
            description: "Keep track of school supplies and assets. Generate stock reports to ensure you never run out of essential items.",
            bg: "#F3E5F5"
        },
        {
            icon: <MdNotifications size={28} color="#FFD166" />,
            title: "Announcements",
            description: "Broadcast important messages to schools, teachers, or students. Ensure timely communication across the platform.",
            bg: "#FFF9C4"
        },
        {
            icon: <MdPeople size={28} color="#06B6D4" />,
            title: "Parents Management",
            description: "Maintain comprehensive parent records, track student-parent relationships, and manage communication with families.",
            bg: "#E0F7FA"
        },
        {
            icon: <MdSchool size={28} color="#8B5CF6" />,
            title: "Teachers & Staff",
            description: "Manage teacher profiles, track performance metrics, monitor attendance, and handle salary information for all staff members.",
            bg: "#F3E8FF"
        },
        {
            icon: <MdNotifications size={28} color="#EF4444" />,
            title: "Support Tickets",
            description: "Track and resolve support requests efficiently. Monitor ticket status, priority levels, and ensure timely resolution of issues.",
            bg: "#FEE2E2"
        },
        {
            icon: <MdInventory size={28} color="#10B981" />,
            title: "Stock Reports",
            description: "Generate detailed inventory reports. Track stock levels, monitor consumption patterns, and plan procurement effectively.",
            bg: "#D1FAE5"
        },
        {
            icon: <MdDashboard size={28} color="#F59E0B" />,
            title: "Reports & Analytics",
            description: "Access comprehensive reports and analytics. Visualize trends, track KPIs, and make data-driven decisions for your institutions.",
            bg: "#FEF3C7"
        },
        {
            icon: <MdPeople size={28} color="#6366F1" />,
            title: "Notes & Documentation",
            description: "Create and manage important notes and documentation. Keep track of meetings, decisions, and important information.",
            bg: "#E0E7FF"
        }
    ];

    const faqs = [
        {
            question: "How do I add a new school?",
            answer: "Navigate to the 'Schools' page from the sidebar and click on the '+ Add New School' button. Fill in the required details and save."
        },
        {
            question: "How can I check pending fees?",
            answer: "Go to the 'Fee Status' page. You can see a breakdown of collected vs. pending fees, and a specific list of students with pending payments."
        },
        {
            question: "Where can I update my profile?",
            answer: "Click on your profile picture in the top right corner and select 'Settings'. You can update your personal information and password there."
        },
        {
            question: "How do I contact support?",
            answer: "If you encounter technical issues, you can raise a support ticket via the 'Support Tickets' section or contact the system administrator."
        },
        {
            question: "What should I do if I forgot my password?",
            answer: "Currently, you can contact the super admin to reset your password. A self-service 'Forgot Password' feature will be available soon."
        },
        {
            question: "How do I generate a stock report?",
            answer: "Go to the 'Stock Report' page. You can view the current inventory levels and export the report if needed."
        },
        {
            question: "Can I manage multiple schools?",
            answer: "Yes, as a super admin, you have access to manage all schools registered on the platform from the 'Schools' dashboard."
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="dashboard-container">
            <TopBar title="Help & Support" showSearch={true} />

            <div className="help-content-wrapper">
                {/* Hero / Welcome Section */}
                <div className="help-hero-card">
                    <div className="hero-icon-wrapper">
                        <MdHelp size={40} color="#fff" />
                    </div>
                    <div>
                        <h2 className="hero-title">How can we help you?</h2>
                        <p className="hero-subtitle">
                            Welcome to the Help Center. Here you can find guides and answers to common questions about managing your school platform.
                        </p>
                    </div>
                </div>

                <div className="help-sections-stack">

                    {/* Features Section */}
                    <section className="help-section">
                        <div className="section-header">
                            <h3 className="section-title">Platform Features</h3>
                        </div>
                        <div className="features-grid">
                            {features.map((feature, index) => (
                                <div key={index} className="feature-card">
                                    <div className="feature-icon" style={{ backgroundColor: feature.bg }}>
                                        {feature.icon}
                                    </div>
                                    <div className="feature-text">
                                        <h4>{feature.title}</h4>
                                        <p>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQs Section */}
                    <section className="help-section">
                        <div className="section-header">
                            <h3 className="section-title">Frequently Asked Questions</h3>
                        </div>
                        <div className="faq-container">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`faq-item ${openFaqIndex === index ? 'active' : ''}`}
                                    onClick={() => toggleFaq(index)}
                                >
                                    <div className="faq-question">
                                        <h4>{faq.question}</h4>
                                        <span className="faq-toggle-icon">
                                            {openFaqIndex === index ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
                                        </span>
                                    </div>
                                    <div className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
                                        <div className="faq-answer-inner">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Contact Support Section (Bottom) */}
                    <section className="help-section">
                        <div className="section-header">
                            <h3 className="section-title">Still need help? Contact Support</h3>
                        </div>

                        <div className="contact-cards-grid">
                            {/* Phone Card */}
                            <div className="contact-card">
                                <div className="contact-icon icon-phone">
                                    <MdPhone size={24} color="#2F80ED" />
                                </div>
                                <div className="contact-text">
                                    <label>Phone</label>
                                    <strong>+91 7032172953</strong>
                                </div>
                            </div>

                            {/* Email Card */}
                            <div className="contact-card">
                                <div className="contact-icon icon-email">
                                    <MdEmail size={24} color="#27AE60" />
                                </div>
                                <div className="contact-text">
                                    <label>Email</label>
                                    <strong>hr@lexci.in</strong>
                                </div>
                            </div>

                            {/* Hours Card */}
                            <div className="contact-card">
                                <div className="contact-icon icon-time">
                                    <MdAccessTime size={24} color="#F2C94C" />
                                </div>
                                <div className="contact-text">
                                    <label>Support Hours</label>
                                    <strong>10:00 AM - 8:00 PM</strong>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>


        </div>
    );
};

export default Help;
