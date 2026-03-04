'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import type { UserType } from '../../services/types';
import axios from '../../services/api';
import { updateMyProfile } from '../../services/user';

export default function ProfilePage() {
  const [form] = Form.useForm<UserType>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.get<UserType>('/users/me');
      form.setFieldsValue(res.data);
    } catch {
      message.error('Failed to load profile');
    }
  };

  const onSubmit = async (values: Partial<UserType>) => {
    try {
      setLoading(true);
      await updateMyProfile(values);
      message.success('Profile updated successfully!');
    } catch {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-wrapper">
      <h2 className="title">My Profile</h2>

      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        className="profile-form"
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item name="role" label="Role">
          <Input disabled />
        </Form.Item>

        <Button htmlType="submit" loading={loading} className="save-btn" block>
          Save Changes
        </Button>
      </Form>

      <style jsx>{`
        .profile-wrapper {
          max-width: 600px;
          margin: 0 auto;
          padding: 36px;
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.02)
          );
          backdrop-filter: blur(35px);
          // box-shadow: 0 40px 100px rgba(0, 0, 0, 0.65);
          color: white;
        }

        .title {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 32px;
        }

        /* Label styling */
        :global(.ant-form-item-label > label) {
          color: #9ca3af !important;
          font-weight: 500;
        }

        /* Dark Inputs */
        :global(.ant-input) {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          color: white !important;
          border-radius: 12px !important;
          height: 44px;
          transition: all 0.25s ease;
        }

        :global(.ant-input::placeholder) {
          color: #6b7280;
        }

        :global(.ant-input:hover) {
          border-color: rgba(59, 130, 246, 0.6) !important;
        }

        :global(.ant-input:focus) {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.6) !important;
        }

        /* Disabled field */
        :global(.ant-input[disabled]) {
          background: rgba(255, 255, 255, 0.02) !important;
          color: #9ca3af !important;
        }

        /* Save Button */
        .save-btn {
          margin-top: 16px;
          height: 46px;
          border-radius: 12px;
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          border: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(59, 130, 246, 0.55);
        }
      `}</style>
    </div>
  );
}
